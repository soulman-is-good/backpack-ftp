"use strict";

var Server = require('./lib/server'),
    //conf = require('./lib/config'),
    server = new Server("127.0.0.1");

server.listen(21,'0.0.0.0');