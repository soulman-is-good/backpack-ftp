"use strict";

var tcp = require("net"),
  EventEmitter = require("events").EventEmitter,
  path = require("path"),
  fs = require("fs");
/*
 TODO:
 - Implement Full RFC 959
 - Implement RFC 2428
 - Implement RFC 2228
 - Implement RFC 3659
 - Implement TLS - http://en.wikipedia.org/wiki/FTPS

 */

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};

function ftpServer (host) {
  var dummy = require("./dummyfs");
  var bridge = require('./mysql_bridge');

  var server = tcp.createServer(function (socket) {
    socket.setTimeout(60000);
    socket.setNoDelay();

    socket.writeln = function (data) {
      console.log("A:", data);
      socket.write(data + "\r\n");
    };

    socket.host = host;
    socket.passive = false;
    socket.pasvport = 6161;
    socket.pasvaddress = "0.0.0.0";
    socket.mode = "ascii";
    socket.filefrom = "";
    socket.username = "";
    socket.password = "";
    socket.authorized = false;
    socket.datatransfer = null;
    socket.totsize = 0;
    socket.filename = "";

    socket.fs = new dummy();
    socket.bridge = new bridge();

    socket.on('timeout', function () {
      if (socket.writable) {
        socket.end("221 Timeout\r\n\r\n\r\n");
      }
    });
  });

  server.on("connection", function (socket) {
    console.log("CMD connect");
    socket.writeln("220 FTP server ready");

    socket.setEncoding('utf8');
    socket.on("data", function (buffer) {
      var data = buffer;
      var value = data.split(" ");
      var command = value.shift().trim();
      console.log("CMD " + command);
      if (!socket.authorized && ['USER', 'PASS', 'AUTH', 'QUIT'].indexOf(command) === -1) {
        socket.writeln("530 Authorization required");
      } else {
        if (fs.existsSync(__dirname + '/commands/' + command.toLowerCase() + '.js')) {
          var module = require('./commands/' + command.toLowerCase());
          module.call(this, socket, command, value);
        } else {
          socket.writeln("202 Not supported");
        }
      }
    });

    socket.on("eof", function () {
      console.log("CMD eof");
      socket.close();
    });

    socket.on("close", function () {
      console.log("CMD close");
    });

  });

  return server;
}
ftpServer.prototype.__proto__ = EventEmitter.prototype;

module.exports = ftpServer;