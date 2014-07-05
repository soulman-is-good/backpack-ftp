"use strict";

module.exports = function (socket, command, value) {
  // Return system type.
  socket.writeln("215 UNIX emulated by NodeFTPd");
};