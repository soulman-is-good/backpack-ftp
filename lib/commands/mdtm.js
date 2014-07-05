"use strict";

module.exports = function (socket, command, value) {
  // Return the last-modified time of a specified file. (RFC 3659)
  var fs = require('fs'),
    path = require('path');
  var filename = path.join(socket.fs.cwd(), value.join(' ').trim());
  fs.stat(filename, function (err, stat) {
    if (err) {
      socket.writeln("550 Error occured");
      console.error(err);
    } else {
      var time = new Date(new Date(stat.mtime).toGMTString());
      var result = time.getUTCFullYear().toString();
      var tmp = (time.getUTCMonth() + 1);
      result += tmp < 10 ? "0" + tmp : tmp;
      tmp = time.getUTCDate();
      result += tmp < 10 ? "0" + tmp : tmp;
      tmp = time.getUTCHours();
      result += tmp < 10 ? "0" + tmp : tmp;
      tmp = time.getUTCMinutes();
      result += tmp < 10 ? "0" + tmp : tmp;
      tmp = time.getUTCSeconds();
      result += tmp < 10 ? "0" + tmp : tmp;
      result += time.getUTCMilliseconds() > 0 ? "." + time.getUTCMilliseconds() : "";
      socket.writeln("213 " + result);
    }
  });
};