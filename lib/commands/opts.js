"use strict";

module.exports = function (socket, command, value) {
  // Select options for a feature. (RFC 2389)
  socket.writeln("202 Not supported");
};