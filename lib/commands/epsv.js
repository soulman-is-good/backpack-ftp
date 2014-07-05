"use strict";

module.exports = function (socket, command, value) {
  // Enter extended passive mode. (RFC 2428)
  socket.writeln("202 Not supported");
};