"use strict";

var tcp = require("net"),
  EventEmitter = require("events").EventEmitter,
  path = require("path"),
  dataServer = require("./dataServer"),
  util = require("util"),
	parseDate = require('./parseDate'),
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
  var Dummy = require("./dummyfs");
  var Bridge = require('./mysql_bridge');

	var cmdDir = __dirname + '/commands';

  var server = tcp.createServer();

  server.on("connection", function (socket) {
    console.log("Socket connected");
		//initialize socket
    socket.setTimeout(60000);
    socket.setNoDelay();
		socket.ip = socket.remoteAddress;

    socket.writeln = function (data) {
      console.log("A:", data);
      socket.write(data + "\r\n");
    };

    console.log = function () {
      var date = parseDate();
      if (socket) {
        this._stdout.write(date + '> ' + socket.ip + ', \x1b[37m' + util.format.apply(this, arguments) + '\x1b[0m\n');
      } else {
        this._stdout.write(date + '> \x1b[37m' + util.format.apply(this, arguments) + '\x1b[0m\n');
      }
    };

    socket.host = host;
    socket.passive = false;
    socket.pasvport = 6161;
    socket.pasvhost = host || "0.0.0.0";
    socket.mode = "ascii";
    socket.filefrom = "";
    socket.username = "";
    socket.password = "";
    socket.authorized = false;
    socket.datatransfer = null;
    socket.totsize = 0;
    socket.filename = "";
    socket.user = {};

    socket.fs = new Dummy();
    socket.bridge = new Bridge();
    socket.passiveServer = dataServer.init(socket);

    socket.on('timeout', function () {
      if (socket.writable) {
        socket.end("221 Timeout\r\n\r\n\r\n");
      }
    });
		///////////////////

    socket.setEncoding('utf8');
    socket.on("data", function (buffer) {
      var data = buffer;
      var value = data.split(" ");
      var command = value.shift().trim();
      console.log("CMD " + command);
      if (!socket.authorized && ['USER', 'PASS', 'AUTH', 'QUIT'].indexOf(command) === -1) {
        socket.writeln("530 Authorization required");
      } else {
        if (fs.existsSync(cmdDir + '/' + command.toLowerCase() + '.js')) {
          var cmdmodule = require(cmdDir + '/' + command.toLowerCase());
          cmdmodule.call(this, socket, command, value);
        } else {
          socket.writeln("202 Not supported");
        }
      }
    });

    socket.on("error", function (err) {
      console.error("CMD error", err);
    });

    socket.on("close", function () {
			socket.passiveServer && socket.passiveServer._handle && socket.passiveServer.close();
      console.log("CMD close");
    });
		
		//Ready. Send welcome message.
    socket.writeln("220 FTP server ready");
  });

  server.on("error", function (err) {
    console.error("Server error", err);
  });

  return server;
}
ftpServer.prototype.__proto__ = EventEmitter.prototype;

module.exports = ftpServer;