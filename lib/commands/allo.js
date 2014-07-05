"use strict";

module.exports = function (socket, command, value) {
  // Allocate sufficient disk space to receive a file.
  socket.writeln("202 Not supported");
};