"use strict";

module.exports = function (socket, command, value) {
  // Clear Command Channel (RFC 2228)
  socket.writeln("202 Not supported");
};