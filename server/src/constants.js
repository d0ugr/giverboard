"use strict";



module.exports = {

  SALT_ROUNDS: 10,

  DEFAULT_SESSION: "sandbox",

  DEFAULT_CARD: {
    content:  {},
    style:    {},
    position: { x: 0, y: 0 },
    size:     "",
    notes:    "",
  },

  DEFAULT_PARTICIPANT: {
    sequence: -1,
    name:     "",
    settings: {},
  },

};

Object.freeze(module.exports);
