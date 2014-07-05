"use strict";

module.exports = function (socket, command, value) {
  // Sets the transfer mode (ASCII/Binary).
  if (value.shift().trim().toUpperCase() === "A") {
    socket.mode = "ascii";
    socket.writeln("200 Type set to A");
  } else {
    socket.mode = "binary";
    socket.writeln("200 Type set to I");
  }
  console.log("Mode switch to", socket.mode);
};