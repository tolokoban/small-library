"use strict";

require("font.josefin");

var $ = require("dom");
var W = require("x-widget").getById;
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
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


exports.onAdd = function() {
  var inpId = W( "add.id" );
  if( !checkId( inpId ) ) return;
  var inpTitle = W( "add.title" );
  if( !checkTitle( inpTitle ) ) return;
  var inpDesc = W( "add.id" );
  var wdgCategories = W( "add.categories" );
  var categories = wdgCategories.value;
  if( categories.length === 0 ) {
    Err( _("missing-cat") );
    W("add.new-category").focus = true;
    return;
  }

  Data.addArticle({
    id: inpId.value,
    title: inpTitle.value,
    desc: inpDesc.value,
    cat: categories
  });
  location = "#search";
};


exports.onNewCategory = function( category ) {
  var wdg = W('add.categories');
  wdg.addCategory( category, true );
  W('add.new-category').value = "";
};


/**
 * Initialiser la page de recherche.
 */
function initSearch() {
  W("search.categories").value = [];
  W("search.categories").list = Data.getCategories();
  if( W("search.categories").list.length === 0 ) {
    location = "#add";
    return;
  }
}


/**
 * Initialiser la page de résultats de recherche.
 */
function initResult() {
  $.clear( "result" );
  var articles = Data.findArticles( W("search.categories").value );
  console.info("[main] articles=", articles);
}


/**
 * Initialiser la page d'ajout d'article.
 */
function initAdd() {
  W("add.id").value = Data.getFreeId();
  W("add.title").value = "";
  W("add.desc").value = "";
  W("add.title").focus = true;
  W("add.categories").value = [];
  W("add.categories").list = Data.getCategories();
}


/**
 * Vérifie  que l'identifiant  entré n'est  pas vide  et n'existe  pas
 * déjà.
 * @param {wdg.text} inp
 */
function checkId( inp ) {
  var id = ("" + inp.value).trim();
  if( id == '' ) {
    Err( _('missing-id') );
    inp.focus = true;
    return false;
  }

  if( Data.exists( id ) ) {
    Err( _('duplicate-id') );
    inp.focus = true;
    return false;
  }
  return true;
}


function checkTitle( inp ) {
  var title = ("" + inp.value).trim();
  if( title == '' ) {
    Err( _('missing-title') );
    inp.focus = true;
    return false;
  }
  return true;
}
