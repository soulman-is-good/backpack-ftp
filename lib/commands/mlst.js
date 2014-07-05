"use strict";

module.exports = function (socket, command, value) {
  // Provides data about exactly the object named on its command line, and no others. (RFC 3659)
  socket.writeln("202 Not supported");
};