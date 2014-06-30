"use strict";

var isDev = process.env.NODE_ENV !== 'production',
  util = require('util');

/**
 * Overload original console logging
 * @param {console} console
 * @returns {undefined}
 */
(function (console) {

  function parseDate () {
    var D = new Date(),
      date;
    date = D.toLocaleString();
    return date.replace(/ GMT.+/, '') + "." + D.getMilliseconds();
  }

  //console.info only development
  console.info = function () {
    if (isDev) {
      this._stdout.write('\x1b[37m' + util.format.apply(this, arguments) + '\x1b[0m\n');
    }
  };

  console.log = function () {
    var date = parseDate();
    this._stdout.write(date + '> \x1b[37m' + util.format.apply(this, arguments) + '\x1b[0m\n');
  };

  console.error = function () {
    var date = parseDate();
    this._stderr.write(date + '> \x1b[31m' + util.format.apply(this, arguments) + '\x1b[0m\n');
  };
}(console));


var host = '0.0.0.0',
  port = 21,
  Server = require('./lib/server'),
  server = new Server(host);

server.listen(port, host, function () {
  console.log("FTP Sever started on ", host + ":" + port);
});