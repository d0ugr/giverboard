// app.js
//
// Main entry point of the app server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");
const bcrypt  = require("bcrypt");

const util = require("./util");
const pg   = require("./pg");

JSON.stringifyPretty = (object) => JSON.stringify(object, null, 2);

const SALT_ROUNDS = 10;



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
app.db.query("SELECT * FROM sessions ORDER BY id")
  .then((res) => {
    for (const session of res.rows) {
      app.sessions[session.session_key] = {
        id:   session.id,
        name: session.name,
        participants: {}
      };
    }
  })
  .catch((err) => console.log(err));

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
      socket.sessionKey = sessionKey;
      socket.join(sessionKey, () => {
        console.log(`socket.join_session: joined ${JSON.stringify(socket.rooms)}`);
        loadSession(sessionKey, (session) => {
          callback("session_joined", session);
        });
      });
    } else {
      callback("error", `Session "${sessionKey}" not found`);
    }
  });

  socket.on("host_login", (password, callback) => {
    app.db.query("SELECT host_password AS hostpassword FROM sessions WHERE session_key = $1",
      [ socket.sessionKey ])
      .then((res) => {
        bcrypt.compare(password, res.rows[0].hostpassword, (err, pwMatch) => {
          app.sessions[socket.sessionKey].participants[socket.clientId].host = pwMatch;
          callback(err, pwMatch);
        });
      })
      .catch((err) => console.error(err, null));
  });

  socket.on("start_session", (callback) => {
    console.log(`socket.start_session`);
    app.db.query("SELECT start FROM sessions WHERE session_key = $1",
      [ socket.sessionKey ])
      .then((res) => {
        if (!res.rows.start) {
          const timestamp = new Date();
          app.db.query("UPDATE sessions SET start = $2 WHERE session_key = $1",
            [ socket.sessionKey, timestamp ])
            .then((_res) => {
              callback(null, timestamp);
            })
            .catch((err) => console.error(err, null));
        } else {
          console.log("socket.start_session: Session already started")
        }
      })
      .catch((err) => console.error(err, null));
  });

  socket.on("stop_session", () => {
    console.log(`socket.start_session`);
    app.db.query("SELECT start FROM sessions WHERE session_key = $1",
      [ socket.sessionKey ])
      .then((res) => {
        if (res.rows.start) {
          const timestamp = new Date();
          app.db.query("UPDATE sessions SET stop = $2 WHERE session_key = $1",
            [ socket.sessionKey, timestamp ])
            .then((_res) => {
              callback(null, timestamp);
            })
            .catch((err) => console.error(err, null));
        } else {
          console.log("socket.stop_session: Not setting stop when there is no start")
        }
      })
      .catch((err) => console.error(err, null));
  });

  // Card events

  // update_card updates a single card and is
  //    intended for real-time updates across clients:
  socket.on("update_card", (id, card) => {
    // console.log(`socket.update_card: ${id}: ${JSON.stringifyPretty(card)}`);
    const currentSession = app.sessions[socket.sessionKey];
    currentSession.cards[id] = {
      ...currentSession.cards[id],
      ...card
    };
    socket.broadcast.to(socket.sessionKey).emit("update_card", id, card);
  });

  // update_cards updates a batch of cards,
  //    or deletes all cards if cards is null, and is
  //    not intended for real-time updates across clients:
  socket.on("update_cards", (cards) => {
    console.log(`socket.update_cards: ${cards ? "..." : cards}`);
    // console.log(`socket.update_cards: ${JSON.stringifyPretty(cards)}`);
    const currentSession = app.sessions[socket.sessionKey];
    if (cards) {
      currentSession.cards = {
        ...session.cards,
        ...cards
      };
    } else {
      currentSession.cards = {};
    }
    socket.broadcast.to(socket.sessionKey).emit("update_cards", cards);
  });

  // Save a card in the database (i.e. on mouseup):
  socket.on("save_card", (id) => {
    console.log(`socket.save_card: ${id}`);
    const currentSession = app.sessions[socket.sessionKey];
    app.db.query("UPDATE cards SET position = $2 WHERE id = $1", [
      id, {
        x: currentSession.cards[id].x,
        y: currentSession.cards[id].y
      }
    ]).catch((err) => console.log(err));
  });

  // Participant events

  socket.on("update_participant", (participant) => {
    console.log(`socket.update_participant: ${JSON.stringify(participant)}`);
    const currentSession       = app.sessions[socket.sessionKey];
    const existingParticipants = currentSession.participants;
    existingParticipants[socket.clientId] = {
      ...existingParticipants[socket.clientId],
      ...participant
    }
    socket.broadcast.to(socket.sessionKey).emit("update_participant", socket.clientId, participant);
    const settings = {};
    if (participant.host) {
      settings.host = participant.host;
    }
    app.db.query("INSERT INTO participants " +
      "(client_key, session_id, name, settings) VALUES ($1, $2, $3, $4) " +
      "ON CONFLICT (client_key) DO UPDATE SET name = $5, settings = $6", [
      socket.clientId, currentSession.id, participant.name, settings,
      participant.name, settings
    ]).catch((err) => console.log(err));
  });

  socket.on("update_current_turn", (currentTurn) => {
    app.sessions[socket.sessionKey].currentTurn = currentTurn;
    socket.broadcast.to(socket.sessionKey).emit("update_current_turn", currentTurn);
  });

  socket.on("update_turns", (turns) => {
    app.sessions[socket.sessionKey].turns = turns;
    socket.broadcast.to(socket.sessionKey).emit("update_turns", turns);
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
  bcrypt.hash(hostPassword, SALT_ROUNDS, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    const sessionKey = util.newUuid();
    app.db.query("INSERT INTO sessions (session_key, name, host_password) VALUES ($1, $2, $3)",
      [ sessionKey, name, (hostPassword ? hashedPassword : "") ])
      .then((_res) => {
        app.sessions[sessionKey] = {
          name,
          cards:        {},
          participants: {}
        };
        callback(null, sessionKey);
      })
      .catch((err) => console.log(err));
  })
};

// const deleteSession = (sessionKey) => {
//   delete app.sessions[sessionKey];
// };



const loadSession = (sessionKey, callback) => {
  const session = app.sessions[sessionKey];
  if (session) {
    if (session.cards) {
      callback(session);
    } else {
      app.db.query("SELECT * FROM cards WHERE session_id = $1",
        [ session.id ])
        .then((res) => {
          session.cards = {};
          for (const card of res.rows) {
            session.cards[card.id] = {
              ...card.position,
              content: card.content
            };
          }
          app.db.query("SELECT * FROM participants WHERE session_id = $1",
            [ session.id ])
            .then((res) => {
              session.participants = {};
              for (const participant of res.rows) {
                session.participants[participant.id] = {
                  name: participant.name
                };
              }
              callback(session);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  } else {
    console.log(`loadSession: BUG: app.sessions[${sessionKey}] is`, session);
  }
};



