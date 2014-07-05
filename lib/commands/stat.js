"use strict";

module.exports = function (socket, command, value) {
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
};