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

app.db = pg({
  host:     process.env.DB_HOSTNAME,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.sessions = {
  default: {
    name: "Default Session",
    cards: {
      kitties:  { x: -100, y: -50, fields: { title: "kitties!",  content: "Kitties are the best." } },
      chickens: { x:    0, y:   0, fields: { title: "chickens!", content: "No, chickens are the best!" } },
      kitckens: { x:  150, y:  60, fields: { title: "kitckens!", content: "Let's breed them and make a half-kitty, half chicken!!!" } }
    }
  }
};

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
    console.dir("socket.get_sessions");
    callback(Object.keys(app.sessions).map((sessionId) => ({ id: sessionId, name: app.sessions[sessionId].name })));
  });

  socket.on("new_session", (name, callback) => {
    console.dir(`socket.new_session: ${name}`);
    if (name && typeof name === "string") {
      socket.sessionId = newSession(name);
      callback("session_created", socket.sessionId);
    } else {
      callback("error", `Cannot create session "${name}"`);
    }
  });

  socket.on("join_session", (sessionId, callback) => {
    console.dir(`socket.join_session: ${sessionId}`);
    if (app.sessions[sessionId]) {
      socket.sessionId = sessionId;
      callback("session_joined", app.sessions[sessionId]);
    } else {
      callback("error", `Session "${sessionId}" not found`);
    }
  });

  socket.on("update_card", (id, card) => {
    // console.dir(`socket.update_cards: ${id}: ${JSON.stringify(card)}`);
    app.sessions[socket.sessionId].cards[id] = {
      ...app.sessions[socket.sessionId].cards[id],
      ...card
    };
    socket.broadcast.emit("update_card", id, card);
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



