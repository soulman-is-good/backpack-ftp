"use strict";

var Server = require('./lib/server'),
    //conf = require('./lib/config'),
    server = new Server("0.0.0.0");

server.listen(21,'0.0.0.0');