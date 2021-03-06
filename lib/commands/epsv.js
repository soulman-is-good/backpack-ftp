"use strict";

module.exports = function (socket, command, value) {
  // Enter extended passive mode. (RFC 2428)
  socket.writeln("202 Not supported"); //not working for now
  return;
  var params = (value[0] && value[0].split('|')) || [];
  params.shift();
  params.pop();
  if (!!params[0] && ['1', '2'].indexOf(params[0]) === -1) {
    socket.writeln("522 Not supported");
    return;
  }
  /*if (!net.isIP(params[1]) || isNaN(params[2])) {
   socket.writeln("500 Wrong params");
   return;
   }*/
  //socket.pasvhost = params[1];
  if (socket.passiveServer && socket.passiveServer._handle) {
    socket.passiveServer.close();
  }
  socket.passive = true;
  socket.pasvhost = socket.host;
  var port = socket.pasvport = parseInt(params[2]) || 0;
  socket.passiveServer.once("listening", function listen () {
    port = socket.pasvport = parseInt(socket.passiveServer.address().port);
    console.log("EPSV on port", socket.pasvport);
    socket.writeln("229 Extended passive mode (|||" + port + "|)");
  });
  socket.passiveServer.listen(port, socket.pasvhost);
};