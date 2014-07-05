"use strict";

module.exports = function (socket, command, value) {
  // Authentication/Security Data (RFC 2228)
  socket.writeln("202 Not supported");
};