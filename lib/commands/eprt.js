"use strict";
/**
 *
 EPRT<space><d><net-prt><d><net-addr><d><tcp-port><d>
 <d> - ASCII characters in range 33-126. The character "|" (ASCII 124) is recommended
 <net-prt> - ADDRESS FAMILY NUMBERS

 Several protocols deal with multiple address families.  The 16-bit
 assignments are listed here.


 Number    Description                                          Reference
 ------    ---------------------------------------------------- ---------
 0    Reserved
 1    IP (IP version 4)
 2    IP6 (IP version 6)
 3    NSAP
 4    HDLC (8-bit multidrop)
 5    BBN 1822
 6    802 (includes all 802 media plus Ethernet "canonical format")
 7    E.163
 8    E.164 (SMDS, Frame Relay, ATM)
 9    F.69 (Telex)
 10    X.121 (X.25, Frame Relay)
 11    IPX
 12    Appletalk
 13    Decnet IV
 14    Banyan Vines
 65535    Reserved

 <net-addr> - protocol specific string address representation of the network address

 Example: EPRT |1|132.235.1.2|6275|

 */
module.exports = function (socket, command, value) {
  // Enter extended passive mode. (RFC 2428)
  socket.writeln("202 Not supported"); //not working for now
  return;
  var net = require('net');
  var params = value[0].split('|');
  params.shift();
  params.pop();
  if (['1', '2'].indexOf(params[0]) === -1) {
    socket.writeln("522 Not supported");
    return;
  }
  if (!net.isIP(params[1]) || isNaN(params[2])) {
    socket.writeln("500 Wrong params");
    return;
  }
  socket.pasvhost = params[1];
  socket.pasvport = parseInt(params[2]);
  socket.writeln("200 Ready to recieve");
};