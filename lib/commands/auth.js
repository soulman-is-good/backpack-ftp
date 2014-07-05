"use strict";

module.exports = function (socket, command, value) {
  // Authentication/Security Mechanism (RFC 2228)
  socket.writeln("502 Not supported");
};