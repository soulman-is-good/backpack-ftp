"use strict";

var Server = require('./lib/server'),
    //conf = require('./lib/config'),
    server = new Server();

server.listen(21,'0.0.0.0');