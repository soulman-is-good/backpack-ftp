"use strict";

module.exports = function (socket, command, value) {
  var tcp = require('net');

  var waitForTransfer = function (psock) {
    if ('function' === typeof socket.datatransfer) {
      socket.datatransfer(psock);
    } else {
      setTimeout(function () {
        waitForTransfer(psock);
      }, 200);
    }
  };
  // Enter passive mode.
  socket.passive = true;
  socket.pasvhost = socket.host;
  socket.pasvport = 0;
  //transfer
  var pasv = tcp.createServer(function (psocket) {
    psocket.on("error", function (err) {
      console.log("===DATA error: ", err);
    });
    psocket.on('end', function () {
      console.log("===DATA end");
      pasv.close();
    });
  });

  pasv.timeoutHandler = setTimeout(function () {
    console.log("Tierd waiting for conneciton...");
    pasv.close();
  }, 60000);

  pasv.on("connection", function (psocket) {
    pasv.timeoutHandler && clearTimeout(pasv.timeoutHandler);
    console.log("===DATA start", psocket.remoteAddress);
    waitForTransfer(psocket);
  });

  pasv.on("listening", function () {
    var port = socket.pasvport = parseInt(pasv.address().port);
    console.log("PASV on port", socket.pasvport);
    var i1 = port >> 8;
    var i2 = port % 256;
    socket.writeln("227 Entering Passive Mode (" + socket.pasvhost.replace(/\./g, ",") + "," + i1 + "," + i2 + ")");
  });
  pasv.listen(0, socket.pasvhost);
  socket.pasv = pasv;
};