"use strict";

module.exports = function (socket, command, value) {
  // Get the feature list implemented by the server. (RFC 2389)
  socket.writeln("211-Features");
  socket.writeln(" SIZE");
  socket.writeln(" MDTM");
  socket.writeln("211 end");
};