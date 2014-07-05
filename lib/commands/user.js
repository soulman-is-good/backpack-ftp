"use strict";

module.exports = function (socket, command, value) {
  // Authentication username.
  socket.username = value.join(' ').trim();
  socket.writeln("331 password required for " + socket.username);
};