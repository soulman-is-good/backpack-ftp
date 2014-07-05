"use strict";

module.exports = function (socket, command, value) {
  // Integrity Protected Command (RFC 2228)
  socket.writeln("202 Not supported");
};