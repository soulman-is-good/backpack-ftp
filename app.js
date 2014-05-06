"use strict";

var Server = require('./lib/server'),
    //conf = require('./lib/config'),
    server = new Server('144.76.210.18');

server.listen(21,'144.76.210.18');