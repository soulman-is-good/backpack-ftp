"use strict";

var tcp = require("net"),
    EventEmitter = require("events").EventEmitter,
    spawn = require("child_process").spawn,
    path = require("path"),
    fs = require("fs");
var Iconv = require('iconv').Iconv;
var translator = new Iconv('utf-8','cp1251');
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
}

function dotrace() {
  console.log.apply(null,arguments);
}

function ftpServer(host) {

  var bridge = require('./mysql_bridge');
  bridge = new bridge();

  var server = tcp.createServer(function (socket) {
    socket.setTimeout(0);
    socket.setNoDelay();
    
    var iconv = new Iconv('CP1251', 'UTF-8');
    socket.writeln = function(data){
      socket.write(iconv.convert(data + "\r\n"));
    }

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

    var dummy = require("./dummyfs");
    socket.fs = new dummy;

  });

  server.on("connection", function (socket) {
    dotrace("CMD connect");
    socket.writeln("220 FTP server ready");

    socket.setEncoding('utf8');
    socket.on("data", function (buffer) {
      var data = buffer;
      var value = data.split(" ");
      var command = value.shift().trim();
      dotrace("CMD " + command);
      if(!socket.authorized && ['USER','PASS','AUTH','QUIT'].indexOf(command) === -1) {
        socket.writeln("530 Authorization required");
      } else {
        switch (command) {
          case "ABOR":
            // Abort an active file transfer.
            socket.writeln("202 Not supported");
            break;
          case "ACCT":
            // Account information
            socket.writeln("202 Not supported");
            break;
          case "ADAT":
            // Authentication/Security Data (RFC 2228)
            socket.writeln("202 Not supported");
            break;
          case "ALLO":
            // Allocate sufficient disk space to receive a file.
            socket.writeln("202 Not supported");
            break;
          case "APPE":
            // Append.
            socket.writeln("202 Not supported");
            break;
          case "AUTH":
            // Authentication/Security Mechanism (RFC 2228)
            socket.writeln("502 Not supported");
            break;
          case "CCC":
            // Clear Command Channel (RFC 2228)
            socket.writeln("202 Not supported");
            break;
          case "CDUP":
            // Change to Parent Directory.
            socket.writeln("250 Directory changed to " + socket.fs.chdir(".."));
            break;
          case "CONF":
            // Confidentiality Protection Command (RFC 697)
            socket.writeln("202 Not supported");
            break;
          case "CWD":
            // Change working directory.
            var dir = (value.join(' ') || "").trim();
            if(!dir) {
              socket.writeln("501 CWD failed. Directory needed.");
            } else {
              socket.fs.chdir(dir);
              var tmp = socket.fs.cwd();
              //socket.writeln("100 CWD Wait...");
              fs.exists(tmp, function(exists){
                if(exists) {
                  socket.writeln("250 CWD successful. \"" + dir + "\" is current directory");
                } else {
                  socket.writeln("550 CWD failed. Directory doesn't exists.");
                }
              });
            }
            break;
          case "DELE":
            // Delete file.
            var file = path.join(socket.fs.cwd(), value.join(' ').trim());
            fs.unlink(file, function(err){
              if(err) {
                console.error(err);
                socket.writeln("550 file not deleted");
              } else {
                socket.writeln("250 file deleted");
              }
            });
            break;
          case "ENC":
            // Privacy Protected Channel (RFC 2228)
            socket.writeln("202 Not supported");
            break;
          case "EPRT":
            // Specifies an extended address and port to which the server should connect. (RFC 2428)
            socket.writeln("202 Not supported");
            break;
          case "EPSV":
            // Enter extended passive mode. (RFC 2428)
            socket.writeln("202 Not supported");
            break;
          case "FEAT":
            // Get the feature list implemented by the server. (RFC 2389)
            socket.writeln("211-Features");
            socket.writeln(" SIZE");
            socket.writeln("211 end");
            break;
          case "HELP":
            // Returns usage documentation on a command if specified, else a general help document is returned.
            /*
             214-The following commands are recognized:
             USER   PASS   QUIT   CWD    PWD    PORT   PASV   TYPE
             LIST   REST   CDUP   RETR   STOR   SIZE   DELE   RMD
             MKD    RNFR   RNTO   ABOR   SYST   NOOP   APPE   NLST
             MDTM   XPWD   XCUP   XMKD   XRMD   NOP    EPSV   EPRT
             AUTH   ADAT   PBSZ   PROT   FEAT   MODE   OPTS   HELP
             ALLO   MLST   MLSD   SITE   P@SW   STRU   CLNT   MFMT
             214 Have a nice day.
             */
            socket.writeln("202 Not supported");
            break;
          case "LANG":
            // Language Negotiation (RFC 2640)
            socket.writeln("202 Not supported");
            break;
          case "LIST":
            // Returns information of a file or directory if specified, else information of the current working directory is returned.
            socket.datatransfer = function (pasvconn) {
              dotrace("DATA connect LIST",socket.fs.cwd());
              var ls = spawn("ls", ["-l", socket.fs.cwd()]);

              ls.stdout.setEncoding(socket.mode);

              //ls.stdout.pipe(pasvconn);

              ls.stdout.on('data',function(data){
                pasvconn.write(data, socket.mode);
              });

              ls.on("close",function(){
                socket.writeln("226 Transfer OK for "+JSON.stringify(pasvconn.address()));
              });

              ls.stderr.on("data",function (err) {
                console.error(err);
              });
            };
            if (!socket.passive) {
              var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
              cli.setEncoding(socket.mode);
              cli.on('connect',function(){
                socket.writeln("150 Connection Accepted");
                socket.datatransfer(cli);
              });
            }
            break;
          case "LPRT":
            // Specifies a long address and port to which the server should connect. (RFC 1639)
            socket.writeln("202 Not supported");
            break;
          case "LPSV":
            // Enter long passive mode. (RFC 1639)
            socket.writeln("202 Not supported");
            break;
          case "MDTM":
            // Return the last-modified time of a specified file. (RFC 3659)
            socket.writeln("202 Not supported");
            break;
          case "MIC":
            // Integrity Protected Command (RFC 2228)
            socket.writeln("202 Not supported");
            break;
          case "MKD":
            // Make directory.
            socket.writeln("202 Not supported");
            break;
          case "MLSD":
            // Lists the contents of a directory if a directory is named. (RFC 3659)
            socket.writeln("202 Not supported");
            break;
          case "MLST":
            // Provides data about exactly the object named on its command line, and no others. (RFC 3659)
            socket.writeln("202 Not supported");
            break;
          case "MODE":
            // Sets the transfer mode (Stream, Block, or Compressed).
            socket.writeln("202 Not supported");
            break;
          case "NLST":
            // Returns a list of file names in a specified directory.
            socket.datatransfer = function (pasvconn) {
              socket.writeln("150 Connection Accepted");
              dotrace("DATA connect");
              var ls = spawn("ls -l " + socket.fs.cwd());
              ls.stdout.pipe(pasvconn);

              ls.on("end", function(){
                socket.write("226 Transfer OK");
              });

              ls.stderr.on("data",function (err) {
                console.error(err)
              });
            };
            if (!socket.passive) {
              var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
              cli.setEncoding(socket.mode);
              cli.on('connect',function(){
                socket.writeln("150 Connection Accepted");
                socket.datatransfer(cli);
              });
            }
            break;
          case "NOOP":
            // No operation (dummy packet; used mostly on keepalives).
            socket.writeln("202 Not supported");
            break;
          case "OPTS":
            // Select options for a feature. (RFC 2389)
            socket.writeln("202 Not supported");
            break;
          case "PASS":
            // Authentication password.
            if(!socket.authorized) {
              var password = value.join(' ').trim();
              bridge.authorize(socket.username, password, function(err,data){
                if(err) {
                  socket.writeln("530 Login failed");
                } else {
                  var dir = (data && data[0] && data[0].homedir) || '/';
                  socket.password = password;
                  socket.authorized = true;
                  socket.fs.setRoot(dir);
                  socket.writeln("230 Logged on root "+dir);
                }
              });
            } else {
              socket.writeln("230 Logged on");
            }
            break;
          case "PASV":
            // Enter passive mode.
            socket.passive = true;
            socket.pasvhost = host;
            socket.pasvport = 0;
            var pasv = tcp.createServer(function (psocket) {

              psocket.setEncoding(socket.mode);
              psocket.on("error", function (err) {
                dotrace("DATA error: ", err);
              });
            });

            pasv.on("connection", function (psocket) {
              dotrace("CONNECTED",psocket.remoteAddress);
              socket.datatransfer(psocket);
            });

            pasv.on("listening", function () {
              var port = socket.pasvport = parseInt(pasv.address().port);
              dotrace("PASV on port",socket.pasvport);
              var i1 = port >> 8;
              var i2 = port % 256;
              socket.writeln("227 Entering Passive Mode (" + socket.pasvhost.replace(/\./g,",") + "," + i1 + "," + i2 + ")");
            });
            pasv.listen(0, socket.pasvhost);
            socket.pasv = pasv;
            break;
          case "PBSZ":
            // Protection Buffer Size (RFC 2228)
            socket.writeln("202 Not supported");
            break;
          case "PORT":
            // Specifies an address and port to which the server should connect.
            socket.passive = false;
            var addr = (value.shift() || "").trim();
            if(!addr || (addr = addr.split(",")).length != 6) {
              socket.writeln("501 Wrong argument");
            } else {
              socket.pasvhost = addr[0] + "." + addr[1] + "." + addr[2] + "." + addr[3];
              socket.pasvport = (parseInt(addr[4]) * 256) + parseInt(addr[5]);
              socket.writeln("200 PORT command successful.");
            }
            break;
          case "PWD":
            // Print working directory. Returns the current directory of the host.
            socket.writeln("257 " + socket.fs.pwd() + " is current directory");
            break;
          case "QUIT":
            // Disconnect.
            socket.end("221 Goodbye\r\n\r\n\r\n");
            break;
          case "REIN":
            // Re initializes the connection.
            socket.writeln("202 Not supported");
            break;
          case "REST":
            // Restart transfer from the specified point.
            socket.totsize = parseInt(value.shift().trim()) || 0;
            socket.writeln("350 Rest supported. Restarting at " + socket.totsize + "");
            break;
          case "RETR":
            // Retrieve (download) a remote file.
            socket.datatransfer = function (pasvconn) {
              dotrace("DATA connect");
              var file = path.join(socket.fs.cwd() + value.join(' ').trim());
              var totsize = socket.totsize;

              var rs = fs.createReadStream(file, {start: totsize});

              rs.pipe(pasvconn);

              rs.on('end', function(){
                socket.totsize = 0;
                dotrace("DATA file " + file + " closed");
                pasvconn.end();
                socket.writeln("226 Closing data connection");
              });

              pasvconn.on("close", function () {
                dotrace("DATA close");
              });
              pasvconn.on("drain", function () {
                dotrace("DATA eof");
              });
              pasvconn.on("error", function (had_error) {
                dotrace("DATA error: ", had_error);
              });
            };
            if (!socket.passive) {
              var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
              cli.setEncoding(socket.mode);
              cli.on('connect',function(){
                socket.writeln("150 Connection Accepted");
                socket.datatransfer(cli);
              });
            }
            break;
          case "RMD":
            // Remove a directory.
            socket.writeln("202 Not supported");
            break;
          case "RNFR":
            // Rename from.
            socket.filefrom = socket.fs.cwd() + value.join(' ').trim();
            socket.writeln("350 File exists, ready for destination name.");
            break;
          case "RNTO":
            // Rename to.
            var fileto = socket.fs.cwd() + value.join(' ').trim();
            var rn = spawn("mv " + socket.filefrom + " " + fileto);
            rn.on("end", function () {
              socket.writeln("250 file renamed successfully");
            });
            rn.on("error", function () {
              socket.writeln("250 file renamed successfully");
            });
            break;
          case "SITE":
            // Sends site specific commands to remote server.
            socket.writeln("202 Not supported");
            break;
          case "SIZE":
            // Return the size of a file. (RFC 3659)
            var filename = path.join(socket.fs.cwd(), value.join(' ').trim());
            fs.stat(filename, function (err, s) {
              if(err){
                console.error(err);
                socket.writeln("500 Error");
              } else {
                socket.writeln("213 " + s.size);
              }
            });
            break;
          case "SMNT":
            // Mount file structure.
            socket.writeln("202 Not supported");
            break;
          case "STAT":
            // Returns the current status.

            /* from FileZilla
             Connected to 192.168.2.100.
             No proxy connection.
             Mode: stream; Type: ascii; Form: non-print; Structure: file
             Verbose: on; Bell: off; Prompting: on; Globbing: on
             Store unique: off; Receive unique: off
             Case: off; CR stripping: on
             Ntrans: off
             Nmap: off
             Hash mark printing: off; Use of PORT cmds: on
             Tick counter printing: off
             */
            socket.writeln("202 Not supported");
            break;
          case "STOR":
            // Store (upload) a file.
            socket.datatransfer = function (pasvconn) {
              var file = path.join(socket.fs.cwd(), value.join(' ').trim());
              dotrace("STOR ",file);
              var ws = fs.createWriteStream(file);
              var size = 0;
              var paused = false;
              var npauses = 0;
  //            pasvconn.pipe(ws);
              pasvconn.on("data", function (data) {
                size += data.length;
                ws.write(data, socket.mode);
                if (!paused) {
                  pasvconn.pause();
                  npauses += 1;
                  paused = true;
                  setTimeout(function () {
                    pasvconn.resume();
                    paused = false;
                  }, 1);
                }
              });
              pasvconn.on("end", function () {
                ws.end();
                socket.writeln("226 Closing data connection, recv " + size + " bytes");
                dotrace("DATA close");
              });
              pasvconn.on("drain", function () {
                dotrace("DATA eof");
              });
              pasvconn.on("error", function (had_error) {
                dotrace("DATA error: ", had_error);
              });
            };
            if (!socket.passive) {
              var cli = tcp.createConnection(socket.pasvport, socket.pasvhost);
              cli.setEncoding(socket.mode);
              cli.on('connect',function(){
                socket.writeln("150 Connection Accepted");
                socket.datatransfer(cli);
              });
            }
            break;
          case "STOU":
            // Store file uniquely.
            socket.writeln("202 Not supported");
            break;
          case "STRU":
            // Set file transfer structure.
            socket.writeln("202 Not supported");
            break;
          case "SYST":
            // Return system type.
            socket.writeln("215 UNIX emulated by NodeFTPd");
            break;
          case "TYPE":
            // Sets the transfer mode (ASCII/Binary).
            if (value.shift().trim().toUpperCase() == "A") {
              socket.mode = "ascii";
              socket.writeln("200 Type set to A");
            } else {
              socket.mode = "binary";
              socket.writeln("200 Type set to I");
            }
            break;
          case "USER":
            // Authentication username.
            socket.username = value.join(' ').trim();
            socket.writeln("331 password required for " + socket.username);
            break;
          case "XPWD":
            //
            socket.writeln("257 " + socket.fs.pwd() + " is the current directory");
            break;
          default:
            socket.writeln("500 Unsupported command");
            break;
        }
      }
    });

    socket.on("eof", function () {
      dotrace("CMD eof");
      socket.close();
    });

    socket.on("close", function () {
      dotrace("CMD close");
    });

  });

  return server;
}
ftpServer.prototype.__proto__ = EventEmitter.prototype;

module.exports = ftpServer;