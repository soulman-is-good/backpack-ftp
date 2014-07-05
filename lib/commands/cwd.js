"use strict";

module.exports = function (socket, command, value) {
  // Change working directory.
  var fs = require('fs'),
    path = require('path');
  var chdir = value.join(' ').trim();
  var dir = path.join(socket.fs.cwd(), chdir);
  fs.exists(dir, function (exists) {
    if (exists) {
      var stat = fs.statSync(dir);
      if (stat.isDirectory()) {
        socket.fs.chdir(chdir);
        //socket.writeln("100 CWD Wait...");
        socket.writeln("250 CWD successful. " + chdir);
      } else {
        socket.writeln("501 Not a directory");
      }
    } else {
      socket.writeln("550 CWD failed. Directory doesn't exists.");
    }
  });
};