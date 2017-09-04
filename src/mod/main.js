"use strict";

require("font.josefin");
var W = require("x-widget").getById;
var Data = require("data");


exports.start = function() {
  if( location.search.trim().length < 2 ) {
    location = "#search";
  }
};

exports.onPage = function( path ) {
  var id = path[0];
  console.info("[main] id=", id);
  switch( id ) {
  case "search":
    initSearch();
    break;
  case "result":
    initResult();
    break;
  case "add":
    initAdd();
    break;
  default:
    location = "#search";
  }
};


exports.onNewCategory = function( category ) {
  var wdg = W('add.categories');
  wdg.addCategory( category, true );
  W('add.new-category').value = "";
};

function initSearch() {
}


function initResult() {
}


function initAdd() {
  W("add.id").value = Data.getFreeId();
  W("add.title").value = "";
  W("add.desc").value = "";
  W("add.title").focus = true;  
}
