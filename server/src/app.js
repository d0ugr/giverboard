// app.js
//
// Main entry point of the WB2020 server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");

const util = require("./util");
const pg   = require("./pg");



const app = {};

// app.sessions = {
//   default: {
//     name: "Default Session",
//     cards: {
//       kitties:  { x: -100, y: -50, fields: { title: "kitties!",  content: "Kitties are the best." } },
//       chickens: { x:    0, y:   0, fields: { title: "chickens!", content: "No, chickens are the best!" } },
//       kitckens: { x:  150, y:  60, fields: { title: "kitckens!", content: "Let's breed them and make a half-kitty, half chicken!!!" } }
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
        name: session.name
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

  socket.on("get_sessions", (callback) => {
    console.log("socket.get_sessions");
    callback(Object.keys(app.sessions).map((sessionId) => ({ id: sessionId, name: app.sessions[sessionId].name })));
  });

  socket.on("new_session", (name, callback) => {
    console.log(`socket.new_session: ${name}`);
    if (name && typeof name === "string") {
      socket.sessionId = newSession(name);
      callback("session_created", socket.sessionId);
    } else {
      callback("error", `Cannot create session "${name}"`);
    }
  });

  socket.on("join_session", (sessionId, callback) => {
    console.log(`socket.join_session: ${sessionId}, in ${JSON.stringify(socket.rooms)}`);
    if (app.sessions[sessionId]) {
      socket.leaveAll();
      socket.sessionId = sessionId;
      socket.join(sessionId, () => {
        console.log(`socket.join_session: joined ${JSON.stringify(socket.rooms)}`);
        loadCards(sessionId, (session) => {
          callback("session_joined", session);
        });
      });
    } else {
      callback("error", `Session "${sessionId}" not found`);
    }
  });

  socket.on("update_card", (id, card) => {
    // console.dir(`socket.update_cards: ${id}: ${JSON.stringify(card)}`);
    loadCards(socket.sessionId, (session) => {
      session.cards[id] = {
        ...session.cards[id],
        ...card
      };
      socket.broadcast.to(socket.sessionId).emit("update_card", id, card);
    });
  });

});

app.srv.listen(process.env.APP_PORT);



const newSession = (name) => {
  const sessionId = util.newUuid();
  app.sessions[sessionId] = { name, cards: {} };
  return sessionId;
};

// const deleteSession = (sessionId) => {
//   delete app.sessions[sessionId];
// };

const loadCards = (sessionId, callback) => {
  if (!app.sessions[sessionId].cards) {
    const dbId = app.sessions[sessionId].id;
    app.db.query("SELECT * FROM cards WHERE session_id = $1", [ dbId ])
      .then((res) => {
        const session = app.sessions[sessionId];
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
  } else {
    callback(app.sessions[sessionId]);
  }
};



