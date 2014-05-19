"use strict";

var host = '127.0.0.1';

var Server = require('./lib/server'),
    server = new Server(host);

server.listen(21,host);