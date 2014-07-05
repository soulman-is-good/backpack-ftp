"use strict";

module.exports = function (socket, command, value) {
  // Re initializes the connection.
  socket.writeln("202 Not supported");
};