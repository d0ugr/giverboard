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
    callback(Object.keys(app.sessions).map((sessionKey) => ({
      id:   sessionKey,
      name: app.sessions[sessionKey].name
    })));
  });

  socket.on("new_session", (name, callback) => {
    console.log(`socket.new_session: ${name}`);
    if (name && typeof name === "string") {
      socket.sessionKey = newSession(name);
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

  socket.on("update_card", (id, card) => {
    // console.dir(`socket.update_cards: ${id}: ${JSON.stringify(card)}`);
    loadCards(socket.sessionKey, (session) => {
      session.cards[id] = {
        ...session.cards[id],
        ...card
      };
      socket.broadcast.to(socket.sessionKey).emit("update_card", id, card);
    });
  });

  // // Save a card in the database (i.e. on mouseup):
  // socket.on("save_card", (id) => {
  //   console.dir(`socket.save_card: ${id}`);
  // });

});

app.srv.listen(process.env.APP_PORT);



const newSession = (name) => {
  const sessionKey = util.newUuid();
  app.sessions[sessionKey] = { name, cards: {} };
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



