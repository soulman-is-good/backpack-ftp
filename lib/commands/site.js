"use strict";

module.exports = function (socket, command, value) {
  // Sends site specific commands to remote server.
  socket.writeln("202 Not supported");
};