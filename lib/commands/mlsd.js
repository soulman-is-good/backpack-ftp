"use strict";

module.exports = function (socket, command, value) {
  // Lists the contents of a directory if a directory is named. (RFC 3659)
  socket.writeln("202 Not supported");
};