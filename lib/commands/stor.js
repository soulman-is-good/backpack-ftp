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
    var size = 0;
    var paused = false;
    var npauses = 0;
    pasvconn.pipe(ws);
    /*pasvconn.on("data", function (data) {
     size += data.length;
     var ok = ws.write(data, socket.mode);
     if (!ok) {
     pasvconn.pause();
     ws.once('drain', function () {
     pasvconn.resume();
     });
     }
     });*/
    pasvconn.on("end", function () {
      //ws.end();
      socket.writeln("226 Closing data connection, recv " + size + " bytes");
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