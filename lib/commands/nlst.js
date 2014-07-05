"use strict";

module.exports = function (socket, command, value) {
  var tcp = require('net'),
    fs = require('fs');
  // Returns a list of file names in a specified directory.
  socket.datatransfer = function (pasvconn) {
    socket.writeln("150 Connection Accepted");
    socket.datatransfer = null;
    console.log("DATA connect");
    fs.readdir(socket.fs.cwd(), function (err, files) {
      if (err) {
        console.error(err);
        socket.write("500 Transfer failed");
      } else {
        pasvconn.write(files.join('\r\n') + '\r\n', socket.mode);
        socket.writeln("226 Transfer OK");
        pasvconn.end();
      }
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