"use strict";

module.exports = function (socket, command, value) {
  // Authentication password.
  if (!socket.authorized) {
    var password = value.join(' ').trim();
    socket.bridge.authorize(socket.username, password, function (err, data) {
      if (err || !data || !data[0]) {
        socket.writeln("530 Login failed");
      } else {
        socket.user = data[0];
        var dir = data[0].homedir || '/';
        socket.password = password;
        socket.authorized = true;
        socket.fs.setRoot(dir);
        socket.writeln("230 " + socket.username + " logged on");
      }
    });
  } else {
    socket.writeln("230 Logged on");
  }
};