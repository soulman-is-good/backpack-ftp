"use strict";

module.exports = function (socket, command, value) {
  // Enter passive mode.
	var host = socket.pasvhost = socket.host;
	socket.passiveServer.init(function(port){
  	socket.passive = true;
  	//transfer
    console.log("PASV on port", port);
    var i1 = port >> 8;
    var i2 = port % 256;
    socket.writeln("227 Entering Passive Mode (" + host.replace(/\./g, ",") + "," + i1 + "," + i2 + ")");
	});
};