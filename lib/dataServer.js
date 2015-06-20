"use strict";

var tcp = require('net');

module.exports = {
  /**
   * Creates new data server
   * @param {net.Socket} socket
   * @returns {net.Server}
   */
  init: function (socket) {
    var pasv = tcp.createServer(function (psocket) {
      psocket.setTimeout(0);
      psocket.on("error", function (err) {
        console.log("===DATA error: ", err);
        pasv.close();
      });
      psocket.on('end', function () {
        console.log("===DATA end");
        socket.datatransfer = null;
        pasv.close();
      });
    });
    pasv.waitForTransfer = function (psock) {
      if ('function' === typeof socket.datatransfer) {
        socket.datatransfer(psock);
      } else if (pasv._handle) {
        pasv.transferTimeout = setTimeout(function () {
          pasv.waitForTransfer(psock);
        }, 200);
      }
    };
    pasv.on("listening", function () {
			console.log("Data channel listening");
      pasv.timeoutHandler = setTimeout(function () {
        console.log("Tierd waiting for conneciton...");
        if (pasv._handle) {
          pasv.close();
        } else {
          console.log("not running...");
        }
      }, 60000);
    });

    pasv.on("connection", function (psocket) {
      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
      }
      console.log("===DATA start", psocket.remoteAddress);
      pasv.waitForTransfer(psocket);
    });

    pasv.on("close", function () {
      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
        this.timeoutHandler = null;
      }
      if (this.transferTimeout) {
        clearTimeout(this.transferTimeout);
        this.transferTimeout = null;
      }
    });

    pasv.on("error", function (err) {
      console.log(err);
      socket.writeln("500 Error occurred");
    });

    return pasv;
  }
};