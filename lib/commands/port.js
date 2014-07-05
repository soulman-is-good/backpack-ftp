"use strict";

module.exports = function (socket, command, value) {
  // Specifies an address and port to which the server should connect.
  socket.passive = false;
  var addr = (value.shift() || "").trim();
  if (!addr || (addr = addr.split(",")).length !== 6) {
    socket.writeln("501 Wrong argument");
  } else {
    socket.pasvhost = addr[0] + "." + addr[1] + "." + addr[2] + "." + addr[3];
    socket.pasvport = (parseInt(addr[4]) * 256) + parseInt(addr[5]);
    socket.writeln("200 PORT command successful.");
  }
};