"use strict";

var EventEmitter = require('events').EventEmitter;

var dummyfs = function() {

  this.dir = "/";

  this.chdir = function(dir) {
    if(dir.charAt(dir.length-1) != "/") dir += "/";
    if(dir.charAt(0) != "/"){
      if(dir.substr(0,2) == ".."){
        var x = dir.split("/");
        for(var i=0; i<x.length; i++){
          if(x[i] == ".."){
            var part = this.dir.split("/");
            part.splice(part.length -2, 1);
            var ret = part.join("/");
            if(ret.charAt(ret.length-1) != "/") ret += "/";
            this.dir = ret;
          }
          else{
            this.dir += x[i];
          }
        }
      }
      else{
        if(dir.substr(0,2) == "./"){
          this.dir += dir.substr(2,dir.length);
        }
        else{
          this.dir += dir;
        }
      }
    }
    else{
      this.dir = dir;
    }
    if(this.dir.charAt(this.dir.length-1) != "/") this.dir += "/";
    return(this.dir);
  }

  this.cwd = function() {
    return(this.dir)
  }
}

dummyfs.prototype.__proto__ = EventEmitter.prototype;
module.exports = dummyfs;