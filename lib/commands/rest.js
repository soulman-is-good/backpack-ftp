"use strict";

module.exports = function (socket, command, value) {
  // Restart transfer from the specified point.
  socket.totsize = parseInt(value.shift().trim()) || 0;
  socket.writeln("350 Rest supported. Restarting at " + socket.totsize + "");
};