"use strict";

var EventEmitter = require('events').EventEmitter;

var path = require('path');

var dummyfs = function() {

  this.root = "/";

  this.dir = "/";

  this.chdir = function(dir) {
    if(dir.indexOf('/') === 0) {
      this.dir = path.normalize(dir);
    } else {
      this.dir = path.join(this.dir, dir);
    }
    return this.dir;
  };

  this.cwd = function() {
    return path.join(this.root, this.dir);
  };

  this.pwd = function() {
    return this.dir;
  };

  this.setRoot = function(root){
    this.root = path.normalize(root);
  };
}

dummyfs.prototype.__proto__ = EventEmitter.prototype;
module.exports = dummyfs;