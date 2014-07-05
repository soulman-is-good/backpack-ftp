"use strict";

module.exports = function (socket, command, value) {
  // Specifies a long address and port to which the server should connect. (RFC 1639)
  socket.writeln("202 Not supported");
};