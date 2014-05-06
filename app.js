"use strict";

var host = '0.0.0.0';

var Server = require('./lib/server'),
    //conf = require('./lib/config'),
    server = new Server(host);

server.listen(21,host);