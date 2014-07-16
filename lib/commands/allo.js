"use strict";

module.exports = function (socket, command, value) {
  // Allocate sufficient disk space to receive a file.
  //TODO: check if user has sufficient space available
  console.log(command, value);
  socket.writeln("202 Not supported");
};