"use strict";

module.exports = function (socket, command, value) {
  // Store (upload) a file.
  var fs = require('fs'),
    tcp = require('net'),
    path = require('path');
  socket.datatransfer = function (pasvconn) {
    socket.writeln("150 Connection Accepted");
    socket.datatransfer = null;
    var file = path.join(socket.fs.cwd(), value.join(' ').trim());
    console.log("STOR ", file);
    var ws = fs.createWriteStream(file);
    pasvconn.pipe(ws, {encoding: socket.mode});
    pasvconn.on("end", function () {
      fs.chown(file, socket.user.uid * 1, 1 * socket.user.gid, function (err) {
        err && console.error(err);
        var stat = fs.statSync(file);
        socket.writeln("226 Closing data connection, recv " + stat.size + " bytes");
        console.log("DATA close");
      });
    });
    pasvconn.on("drain", function () {
      console.log("DATA eof");
    });
    pasvconn.on("error", function (had_error) {
      console.log("DATA error: ", had_error);
    });
  };
  if (!socket.passive) {
    var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
    cli.on('connect', function () {
      socket.datatransfer(cli);
    });
  }
};