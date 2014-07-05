"use strict";

module.exports = function (socket, command, value) {
  // Change to Parent Directory.
  socket.writeln("250 Directory changed to " + socket.fs.chdir(".."));
};