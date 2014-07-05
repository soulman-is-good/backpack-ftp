"use strict";

module.exports = function (socket, command, value) {
  var tcp = require('net');
  var spawn = require('child_process').spawn;
  // Returns information of a file or directory if specified, else information of the current working directory is returned.
  socket.datatransfer = function (pasvconn) {
    socket.writeln("150 Connection Accepted");
    socket.datatransfer = null;
    console.log("DATA connect LIST", socket.fs.cwd(), socket.mode);
    var ls = spawn("ls", ["-l", socket.fs.cwd()]),
      line = 0;
    ls.stdout.setEncoding(socket.mode);
    ls.stdout.on('data', function (data) {
      var lines = data.split('\n');
      for (var i in lines) {
        if (line > 0) {
          pasvconn.write(lines[i].trim() + '\r\n', socket.mode);
        }
        line++;
      }
    });

    ls.on("close", function () {
      socket.writeln("226 Transfer OK");
      pasvconn.end();
    });

    ls.stderr.on("data", function (err) {
      console.error(err.toString());
    });
  };
  if (!socket.passive) {
    var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
    cli.setEncoding(socket.mode);
    cli.on('connect', function () {
      socket.datatransfer(cli);
    });
  }
};