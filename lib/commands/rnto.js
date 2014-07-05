"use strict";

module.exports = function (socket, command, value) {
  // Rename to.
  var fs = require('fs');
  var fileto = socket.fs.cwd() + value.join(' ').trim();

  fs.rename(socket.filefrom, fileto, function (err) {
    if (err) {
      console.log("RNTO Error", err);
      socket.writeln("500 file rename error occurred");
    } else {
      socket.writeln("250 file renamed successfully");
    }
  });
};