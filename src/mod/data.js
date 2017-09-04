/**
 * Les données persistantes sont gérées ici.
 */

"use strict";

var Local = require("tfw.storage").local;

var g_data = Local.get( "small-library", {
  id: 0,
  cat: [],
  art: []
});


exports.getFreeId = function() {
  return 1;
};


exports.save = function() {
  Local.set( "small-library", g_data );
};
