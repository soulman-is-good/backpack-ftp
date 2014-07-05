"use strict";

module.exports = function (socket, command, value) {
  // No operation (dummy packet; used mostly on keepalives).
  socket.writeln("200 OK");
};