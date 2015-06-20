"use strict";

module.exports = function (socket, command, value) {
  // Enter passive mode.
//  if (socket.passiveServer) {
//    socket.passiveServer.close();
//  }
  socket.passive = true;
  socket.pasvhost = socket.host;
  socket.pasvport = 0;
  //transfer
  var pasv = socket.passiveServer;
  pasv.once("listening", function listen () {
    var port = socket.pasvport = parseInt(pasv.address().port);
    console.log("PASV on port", socket.pasvport);
    var i1 = port >> 8;
    var i2 = port % 256;
    socket.writeln("227 Entering Passive Mode (" + socket.pasvhost.replace(/\./g, ",") + "," + i1 + "," + i2 + ")");
  });
  pasv.listen(0, socket.pasvhost);
};