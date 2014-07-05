"use strict";

module.exports = function (socket, command, value) {
  // Abort an active file transfer.
  socket.writeln("202 Not supported");
};