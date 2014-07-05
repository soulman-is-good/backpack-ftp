"use strict";

module.exports = function (socket, command, value) {
  // Enter long passive mode. (RFC 1639)
  socket.writeln("202 Not supported");
};