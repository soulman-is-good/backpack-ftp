"use strict";

module.exports = function (socket, command, value) {
  // Return the size of a file. (RFC 3659)
  var fs = require('fs'),
    path = require('path');
  var filename = path.join(socket.fs.cwd(), value.join(' ').trim());
  fs.stat(filename, function (err, s) {
    if (err) {
      console.error(err, filename, value);
      socket.writeln("500 Error");
    } else {
      socket.writeln("213 " + s.size);
    }
  });
};