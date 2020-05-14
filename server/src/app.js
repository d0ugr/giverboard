// app.js
//
// Main entry point of the WB2020 server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");

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
app.db.query("SELECT * FROM sessions")
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
  socket.emit("server_message", "WB2020 ready to be super fun");

  socket.on("disconnect", () => {
    console.log(`socket.disconnect: ${socket.id}`);
  });

  socket.on("client_init", (clientId) => {
    console.log(`socket.client_init: ${clientId}`);
    socket.clientId = clientId;
  });

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
      socket.sessionKey = newSession(name, hostPassword);
      callback("session_created", socket.sessionKey);
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
        loadCards(sessionKey, (session) => {
          callback("session_joined", session);
        });
      });
    } else {
      callback("error", `Session "${sessionKey}" not found`);
    }
  });

  // update_card updates a single card and is
  //    intended for real-time updates across clients:
  socket.on("update_card", (id, card) => {
    // console.log(`socket.update_card: ${id}: ${JSON.stringifyPretty(card)}`);
    loadCards(socket.sessionKey, (session) => {
      session.cards[id] = {
        ...session.cards[id],
        ...card
      };
      socket.broadcast.to(socket.sessionKey).emit("update_card", id, card);
    });
  });

  // update_cards updates a batch of cards,
  //    or deletes all cards if cards is null, and is
  //    not intended for real-time updates across clients:
  socket.on("update_cards", (cards) => {
    console.log(`socket.update_cards: ${cards ? "..." : cards}`);
    // console.log(`socket.update_cards: ${JSON.stringifyPretty(cards)}`);
    if (cards) {
      loadCards(socket.sessionKey, (session) => {
        session.cards = {
          ...session.cards,
          ...cards
        };
      });
    } else {
      app.sessions[socket.sessionKey].cards = {};
    }
    socket.broadcast.to(socket.sessionKey).emit("update_cards", cards);
  });

  // Save a card in the database (i.e. on mouseup):
  socket.on("save_card", (id) => {
    console.log(`socket.save_card: ${id}`);
    app.db.query("UPDATE cards SET position = $2 WHERE id = $1", [
      id, {
        x: app.sessions[socket.sessionKey].cards[id].x,
        y: app.sessions[socket.sessionKey].cards[id].y
      }
    ]).catch((err) => console.log(err));
  });

  socket.on("update_participant", (participant) => {
    console.log(`socket.update_participant: ${JSON.stringify(participant)}`);
    app.sessions[socket.sessionKey].participants[socket.clientId] = participant;
    socket.broadcast.to(socket.sessionKey).emit("update_participant", socket.clientId, participant);
  });

  socket.on("debug_sessions", () => {
    console.log("socket.debug_sessions:", JSON.stringifyPretty(app.sessions));
  });

});

app.srv.listen(process.env.APP_PORT);



const newSession = (name, hostPassword) => {
  const sessionKey = util.newUuid();
  app.sessions[sessionKey] = {
    name,
    cards:        {},
    participants: {}
  };
  app.db.query("INSERT INTO sessions (session_key, name, host_password) VALUES ($1, $2, $3)", [
    sessionKey, name, hostPassword
  ])
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  return sessionKey;
};

// const deleteSession = (sessionKey) => {
//   delete app.sessions[sessionKey];
// };



const loadCards = (sessionKey, callback) => {
  if (app.sessions[sessionKey].cards) {
    callback(app.sessions[sessionKey]);
  } else {
    const dbId = app.sessions[sessionKey].id;
    app.db.query("SELECT * FROM cards WHERE session_id = $1", [ dbId ])
      .then((res) => {
        const session = app.sessions[sessionKey];
        session.cards = {};
        for (const card of res.rows) {
          session.cards[card.id] = {
            x:       card.position.x,
            y:       card.position.y,
            content: card.content
          };
        }
        callback(session);
      })
      .catch((err) => console.log(err));
  }
};



