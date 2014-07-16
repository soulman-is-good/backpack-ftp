"use strict";

var mysql = require('mysql');

var mysql_bridge = function () {

  var conf = {
    host: 'localhost',
    user: 'root',
    password: '1234qwert=',
    database: 'proftpd'
  };

  this.authorize = function (user, pass, cb) {
    cb = cb || function () {
    };

    var connection = mysql.createConnection(conf);

    connection.connect(function (err) {
      if (err) {
        cb(err);
      } else {
        connection.query("SELECT * FROM ftpuser WHERE userid=? AND passwd=? LIMIT 1", [user, pass], function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length === 0) {
              var error = new Error('Authorization failed');
              cb(error);
            } else {
              var time = new Date().toISOString().replace(/[T]/, ' ').replace(/\.+$/, '');
              connection.query("UPDATE ftpuser SET accessed=?, `count`=`count`+1", [time], function (err) {
                if (err) {
                  console.error(err);
                }
              });
              cb(null, data);
            }
          }
          connection.end();
        });
      }
    });

  }

}

module.exports = mysql_bridge;