"use strict";

module.exports = function (socket, command, value) {
  // Retrieve (download) a remote file.
  var fs = require('fs'),
    tcp = require('net'),
    path = require('path');
  socket.datatransfer = function (pasvconn) {
    socket.writeln("150 Connection Accepted");
    socket.datatransfer = null;
    var file = path.join(socket.fs.cwd(), value.join(' ').trim());
    var totsize = socket.totsize;

    var rs = fs.createReadStream(file, {start: totsize});

    rs.pipe(pasvconn);

    rs.on('end', function () {
      socket.totsize = 0;
      console.log("DATA file " + file + " closed");
      socket.writeln("226 Closing data connection");
    });

    pasvconn.on("close", function () {
      console.log("DATA close");
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
    cli.setEncoding(socket.mode);
    cli.on('connect', function () {
      socket.writeln("150 Connection Accepted");
      socket.datatransfer(cli);
    });
  }
};