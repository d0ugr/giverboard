const uuid = require("uuid");



exports.newUuid = () => uuid.v4().replace(/-/g, "");



