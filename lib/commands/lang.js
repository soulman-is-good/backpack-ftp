"use strict";

module.exports = function (socket, command, value) {
  // Language Negotiation (RFC 2640)
  socket.writeln("202 Not supported");
};