"use strict";

module.exports = function (socket, command, value) {
  // Confidentiality Protection Command (RFC 697)
  socket.writeln("202 Not supported");
};