"use strict";

module.exports = function (socket, command, value) {
  // Rename from.
  socket.filefrom = socket.fs.cwd() + value.join(' ').trim();
  socket.writeln("350 File exists, ready for destination name.");
};