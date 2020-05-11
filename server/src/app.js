// app.js
//
// Main entry point of the WB2020 server.

"use strict";



require("dotenv").config();
const http    = require("http");
const express = require("express");



const app = {};

app.exp = express();
app.srv = http.Server(app.exp);
app.exp.server_name = "";
app.exp.set("trust proxy", "loopback");
app.exp.set("x-powered-by", false);

const io = require("socket.io")(app.srv);

io.on("connection", socket => {
  console.log("io.connection");
  socket.emit("stuff", "super fun");

  socket.on("stuff", (data) => {
    console.dir(`socket.stuff: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("socket.disconnect");
  });
});

app.srv.listen(process.env.APP_PORT);
