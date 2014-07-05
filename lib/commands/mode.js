"use strict";

module.exports = function (socket, command, value) {
  // Sets the transfer mode (Stream, Block, or Compressed).
  socket.writeln("202 Not supported");
};