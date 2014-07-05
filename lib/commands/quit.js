"use strict";

module.exports = function (socket, command, value) {
  // Disconnect.
  socket.end("221 Goodbye\r\n\r\n\r\n");
};