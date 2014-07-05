"use strict";

module.exports = function (socket, command, value) {
  // Delete file.
  var fs = require('fs'),
    path = require('path');
  var file = path.join(socket.fs.cwd(), value.join(' ').trim());
  fs.unlink(file, function (err) {
    if (err) {
      console.error(err);
      socket.writeln("550 file not deleted");
    } else {
      socket.writeln("250 file deleted");
    }
  });
};