"use strict";

module.exports = function (socket, command, value) {
  // Print working directory. Returns the current directory of the host.
  socket.writeln("257 " + socket.fs.pwd());
};