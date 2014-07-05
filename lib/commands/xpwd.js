"use strict";

module.exports = function (socket, command, value) {
  socket.writeln("257 " + socket.fs.pwd() + " is the current directory");
};