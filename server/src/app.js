// app.js
//
// Main entry point of the app server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");
const bcrypt  = require("bcrypt");

const c    = require("./constants");
const util = require("./util");
const pg   = require("./pg");

JSON.stringifyPretty = (object) => JSON.stringify(object, null, 2);



const app = {};

// app.sessions = {
//   sessionKey: {
//     name: <name>,
//     cards: {
//       <id>:  { x: 0, y: 0, content: { title: <title>, body: <body> } },
//       ...
//     },
//     participants: {
//       <clientId>: {
//         name: <name>
//     }
//   }
// };

app.db = pg({
  host:     process.env.DB_HOSTNAME,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.sessions = {};
app.db.query("SELECT id, session_key, name, description, settings, start, stop FROM sessions ORDER BY id")
  .then((res) => {
    for (const session of res.rows) {
      app.sessions[session.session_key] = {
        ...session,
        currentTurn:  (session.settings.currentTurn || 0),
        // The absence of cards and participants here
        //    indicates the session needs to be loaded.
        // cards:        {},
        // participants: {}
      };
      delete app.sessions[session.session_key].session_key;
    }
  })
  .catch((err) => console.error(err));

app.exp = express();
app.srv = http.Server(app.exp);
// eslint-disable-next-line camelcase
app.exp.server_name = "";
app.exp.set("trust proxy", "loopback");
app.exp.set("x-powered-by", false);

app.io = require("socket.io")(app.srv);

app.io.on("connection", (socket) => {
  console.log(`io.connection: ${socket.id}`);
  socket.emit("server_message", `${process.env.APP_NAME} ready to be super fun`);

  socket.on("disconnect", () => {
    console.log(`socket.disconnect: ${socket.id}`);
  });

  socket.on("client_init", (clientId) => {
    console.log(`socket.client_init: ${clientId}`);
    socket.clientId = clientId;
  });

  // Session events

  socket.on("get_sessions", (callback) => {
    console.log("socket.get_sessions");
    callback(Object.keys(app.sessions).map((sessionKey) => ({
      id:   sessionKey,
      name: app.sessions[sessionKey].name
    })));
  });

  socket.on("new_session", (name, hostPassword, callback) => {
    console.log(`socket.new_session: ${name} / ${hostPassword || "<no password>"}`);
    if (name && typeof name === "string") {
      newSession(name, hostPassword, (err, sessionKey) => {
        if (!err) {
          socket.sessionKey = sessionKey;
          callback("session_created", sessionKey);
        } else {
          callback("error", err);
        }
      });
    } else {
      callback("error", `Cannot create session "${name}"`);
    }
  });

  socket.on("join_session", (sessionKey, callback) => {
    console.log(`socket.join_session: ${sessionKey}, in ${JSON.stringify(socket.rooms)}`);
    if (app.sessions[sessionKey]) {
      socket.leaveAll();
      socket.sessionId  = app.sessions[sessionKey].id;
      socket.sessionKey = sessionKey;
      socket.join(sessionKey, () => {
        console.log(`socket.join_session: ${socket.clientId} joined ${JSON.stringify(socket.rooms)}`);
        loadSession(sessionKey, (session) => {
          callback("session_joined", session);
        });
      });
    } else {
      callback("error", `Session "${sessionKey}" not found`);
    }
  });

  // Update the current participants's viewbox in real-time:
  socket.on("update_canvas", (viewBox) => {
    console.log(`socket.update_canvas: ${socket.sessionKey} ${socket.clientId} ${JSON.stringify(viewBox)}`);
    const currentParticipant = app.sessions[socket.sessionKey].participants[socket.clientId];
    if (currentParticipant) {
      currentParticipant.settings.viewBox = viewBox;
    } else {
      console.warn("socket.update_canvas: Not a participant");
    }
  });

  // Save a participant's settings in the database
  //    (e.g. on mouseup after panning the canvas):
  socket.on("save_settings", () => {
    console.log(`socket.save_settings`);
    const currentParticipant = getCurrentParticipant(socket);
    if (currentParticipant) {
      // console.log(`socket.save_settings: ${socket.sessionId} ${socket.clientId}`);
      app.db.query("UPDATE participants SET settings = $3 WHERE session_id = $1 AND client_key = $2", [
        socket.sessionId, socket.clientId, currentParticipant.settings
      ]).catch((err) => console.error(err));
    } else {
      console.warn("socket.save_settings: Not a participant");
    }
  });

  socket.on("host_login", (password, callback) => {
    const currentParticipant = getCurrentParticipant(socket);
    if (currentParticipant) {
      app.db.query("SELECT host_password AS hostpassword FROM sessions WHERE session_key = $1",
        [ socket.sessionKey ])
        .then((res) => {
          bcrypt.compare(password, res.rows[0].hostpassword, (err, pwMatch) => {
            currentParticipant.settings.host = pwMatch;
            callback(err, pwMatch);
          });
        })
        .catch((err) => {
          callback(err);
          console.error(err)
        });
      } else {
        console.warn("socket.host_login: Not a participant");
      }
    });

  socket.on("update_participant_sequence", (participantKeys) => {
    const sessionId = app.sessions[socket.sessionKey].id;
    for (const index in participantKeys) {
      app.db.query("UPDATE participants SET sequence = $3 WHERE session_id = $1 AND client_key = $2",
        [ sessionId, participantKeys[index], index ])
        .then((res) => console.log(res.rows))
        .catch((err) => console.error(err, null));
    }
  });

  socket.on("start_session", (callback) => {
    console.log(`socket.start_session`);
    const timestamp = new Date();
    app.db.query("UPDATE sessions SET start = $2, stop = NULL WHERE session_key = $1",
      [ socket.sessionKey, timestamp ])
      .then((_res) => {
        app.sessions[socket.sessionKey].start = timestamp;
        app.sessions[socket.sessionKey].stop  = null;
        callback(null, timestamp);
        socket.broadcast.to(socket.sessionKey).emit("start_session", timestamp);
      })
      .catch((err) => {
        callback(err);
        console.error(err)
      });
  });

  socket.on("stop_session", (callback) => {
    console.log(`socket.start_session`);
    if (app.sessions[socket.sessionKey].start) {
      const timestamp = new Date();
      app.db.query("UPDATE sessions SET stop = $2 WHERE session_key = $1",
        [ socket.sessionKey, timestamp ])
        .then((_res) => {
          app.sessions[socket.sessionKey].stop = timestamp;
          callback(null, timestamp);
          socket.broadcast.to(socket.sessionKey).emit("stop_session", timestamp);
        })
        .catch((err) => {
          callback(err);
          console.error(err)
        });
    } else {
      callback("Session has not been started");
      console.warn("socket.stop_session: Session has not been started")
    }
  });

  socket.on("clear_session", (callback) => {
    console.log(`socket.clear_session`);
    app.db.query("UPDATE sessions SET start = NULL, stop = NULL WHERE session_key = $1",
      [ socket.sessionKey ])
      .then((_res) => {
        app.sessions[socket.sessionKey].start       = null;
        app.sessions[socket.sessionKey].stop        = null;
        app.sessions[socket.sessionKey].currentTurn = 0;
        callback(null);
        socket.broadcast.to(socket.sessionKey).emit("clear_session");
      })
      .catch((err) => {
        callback(err);
        console.error(err)
      });
  });

  socket.on("delete_session", (sessionKey, callback) => {
    console.log(`socket.delete_session`);
    if (!sessionKey) {
      sessionKey = socket.sessionKey;
    }
    app.db.query("DELETE FROM sessions WHERE session_key = $1",
      [ sessionKey ])
      .then((_res) => {
        delete app.sessions[sessionKey];
        callback(null, (sessionKey === socket.sessionKey ? c.DEFAULT_SESSION : null));
        socket.broadcast.to(sessionKey).emit("delete_session", sessionKey);
      })
      .catch((err) => {
        callback(err);
        console.error(err)
      });
  });

  // Card events

  // update_card updates a single card:
  //    Not intended for real-time updates across clients
  //    (use update_card_position and save_card_position afterwards instead).
  socket.on("update_card", (cardKey, card) => {
    // console.log(`socket.update_card: ${id}: ${JSON.stringifyPretty(card)}`);
    const currentSession = app.sessions[socket.sessionKey];
    if (card) {
      currentSession.cards[cardKey] = {
        ...c.DEFAULT_CARD,
        ...currentSession.cards[cardKey],
        ...card
      };
      saveCard(app.sessions[socket.sessionKey].id, currentSession.cards[cardKey])
        .catch((err) => console.error(err));
    } else {
      delete currentSession.cards[cardKey];
      app.db.query("DELETE FROM cards WHERE card_key = $1", [
        cardKey
      ]).catch((err) => console.error(err));
    }
    socket.broadcast.to(socket.sessionKey).emit("update_card", cardKey, card);
  });

  // update_cards updates a batch of cards,
  //    or deletes all cards if cards is null, and is
  //    not intended for real-time updates across clients:
  socket.on("update_cards", (cards) => {
    // console.log(`socket.update_cards: ${cards ? "..." : cards}`);
    // console.log(`socket.update_cards: ${JSON.stringifyPretty(cards)}`);
    const currentSession = app.sessions[socket.sessionKey];
    if (cards) {
      currentSession.cards = {
        ...currentSession.cards,
        ...cards
      };
      for (const cardKey in cards) {
        saveCard(app.sessions[socket.sessionKey].id, cards[cardKey])
          .catch((err) => console.error(err));
      }
    } else {
      currentSession.cards = {};
      app.db.query("DELETE FROM cards WHERE session_id = $1", [
        app.sessions[socket.sessionKey].id
      ]).catch((err) => console.error(err));
    }
    socket.broadcast.to(socket.sessionKey).emit("update_cards", cards);
  });

  // update_card_position updates a single card and is
  //    intended for real-time updates across clients:
  socket.on("update_card_position", (cardKey, card) => {
    // console.log(`socket.update_card: ${id}: ${JSON.stringifyPretty(card)}`);
    const currentSession = app.sessions[socket.sessionKey];
    if (card) {
      currentSession.cards[cardKey] = {
        ...c.DEFAULT_CARD,
        ...currentSession.cards[cardKey],
        ...card
      };
    }
    socket.broadcast.to(socket.sessionKey).emit("update_card", cardKey, card);
  });

  // Save a card in the database (i.e. on mouseup):
  socket.on("save_card_position", (cardKey) => {
    console.log(`socket.save_card_position: ${cardKey}`);
    const currentSession = getCurrentSession(socket);

    app.db.query("UPDATE cards SET position = $2 WHERE card_key = $1", [
      cardKey, { ...currentSession.cards[cardKey].position }
    ]).catch((err) => console.error(err));
  });

  // Participant events

  socket.on("update_participant", (participant) => {
    console.log(`socket.update_participant: ${JSON.stringify(participant)}`);
    // Merge the change into the existing participant data:
    const currentSession       = app.sessions[socket.sessionKey];
    const existingParticipants = currentSession.participants;
    participant = {
      ...c.DEFAULT_PARTICIPANT,
      ...existingParticipants[socket.clientId],
      ...participant
    };
    existingParticipants[socket.clientId] = participant;
    // Notify other clients in the session about the change:
    socket.broadcast.to(socket.sessionKey).emit("update_participant", socket.clientId, participant);
    // Update the database:
    app.db.query("INSERT INTO participants " +
      "(client_key, session_id, name, settings) VALUES ($1, $2, $3, $4) " +
      "ON CONFLICT ON CONSTRAINT unique_session_client DO UPDATE SET name = $3, settings = $4", [
      socket.clientId, currentSession.id,
      participant.name || "", participant.settings || {}
    ])
      .catch((err) => console.error(err));
  });

  socket.on("update_current_turn", (currentTurn) => {
    console.log(`socket.update_current_turn: ${currentTurn}`)
    getCurrentSession(socket).currentTurn = currentTurn;
    socket.broadcast.to(socket.sessionKey).emit("update_current_turn", currentTurn);
    app.db.query("UPDATE sessions SET settings = jsonb_set(settings, '{currentTurn}', $2) WHERE session_key = $1", [
      socket.sessionKey, currentTurn
    ]).catch((err) => console.error(err));
  });

  // Debug events

  socket.on("debug_sessions", () => {
    console.log("socket.debug_sessions:", JSON.stringifyPretty(app.sessions));
  });

});

app.srv.listen(process.env.APP_PORT);



const newSession = (name, hostPassword, callback) => {
  // Hash the password even if it's blank (indicating no host)
  //    and check for that when updating the database
  //    to avoid multiple callback chains:
  bcrypt.hash(hostPassword, c.SALT_ROUNDS, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    const sessionKey = util.newUuid();
    app.db.query("INSERT INTO sessions (session_key, name, host_password) VALUES ($1, $2, $3) RETURNING id",
      [ sessionKey, name, (hostPassword ? hashedPassword : "") ])
      .then((res) => {
        app.sessions[sessionKey] = {
          id:           res.rows[0].id,
          name,
          cards:        {},
          participants: {}
        };
        callback(null, sessionKey);
      })
      .catch((err) => console.error(err));
  })
};

const loadSession = (sessionKey, callback) => {
  const session = app.sessions[sessionKey];
  if (session) {
    if (session.cards && session.participants) {
      callback(session);
    } else {
      app.db.query("SELECT * FROM cards WHERE session_id = $1 ORDER BY id",
        [ session.id ])
        .then((res) => {
          session.cards = {};
          for (const card of res.rows) {
            delete card.id;
            delete card.session_id;
            card.cardKey = card.card_key;
            delete card.card_key;
            session.cards[card.cardKey] = { ...card };
          }
          app.db.query("SELECT * FROM participants WHERE session_id = $1 ORDER BY sequence, name",
            [ session.id ])
            .then((res) => {
              session.participants = {};
              for (const participant of res.rows) {
                session.participants[participant.client_key.toLowerCase()] = {
                  name:     participant.name,
                  sequence: participant.sequence,
                  settings: participant.settings
                };
              }
              callback(session);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  } else {
    console.error(`loadSession: BUG: app.sessions[${sessionKey}] is`, session);
  }
};

const saveCard = (sessionId, card) => {
  // console.log("saveCard:", card)
  return app.db.query("INSERT INTO cards " +
    "(card_key, session_id, content, style, position, size, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) " +
    "ON CONFLICT (card_key) DO UPDATE " +
    "SET content = $3, style = $4, position = $5, size = $6, notes = $7", [
      card.cardKey, sessionId,
    card.content || {}, card.style || {}, card.position || {}, card.size || "", card.notes || ""
  ]);
};

const getCurrentSession = (socket) =>
  app.sessions[socket.sessionKey];

const getCurrentParticipant = (socket) =>
  app.sessions[socket.sessionKey] &&
  app.sessions[socket.sessionKey].participants &&
  app.sessions[socket.sessionKey].participants[socket.clientId];



