"use strict";

module.exports = function (socket, command, value) {
  // Specifies an extended address and port to which the server should connect. (RFC 2428)
  socket.writeln("202 Not supported");
};