"use strict";

module.exports = function (socket, command, value) {
  // Protection Buffer Size (RFC 2228)
  socket.writeln("202 Not supported");
};