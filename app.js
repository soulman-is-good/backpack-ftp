"use strict";

var host = '0.0.0.0';

var Server = require('./lib/server'),
    server = new Server(host);

server.listen(21,host);