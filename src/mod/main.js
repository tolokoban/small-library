"use strict";

require("font.josefin");

var $ = require("dom");
var W = require("x-widget").getById;
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Data = require("data");
var Modal = require("wdg.modal");
var Button = require("wdg.button");

// Pour savoir si on est en  mode "AJOUT" ou "EDITION". Dans le second
// cas, `g_currentArticle` est l'objet à éditer.
var g_currentArticle;


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
    // "#add est" un ajout de nouvel article.
    // "#add/TOTO" est l'édition de l'article dont l'identifiant est "TOTO".
    initAdd( path[1] );
    break;
  default:
    location = "#search";
  }
};


exports.onAdd = function() {
  // On commence par vérifier les champs.
  var inpId = W( "add.id" );
  if( !checkId( inpId ) ) return;
  var inpTitle = W( "add.title" );
  if( !checkTitle( inpTitle ) ) return;
  var inpDesc = W( "add.desc" );
  var wdgCategories = W( "add.categories" );
  var categories = wdgCategories.value;
  if( categories.length === 0 ) {
    Err( _("missing-cat") );
    W("add.new-category").focus = true;
    return;
  }

  if( typeof g_currentArticle === 'undefined' ) {
    // AJOUT.
    Data.addArticle({
      id: inpId.value,
      title: inpTitle.value,
      desc: inpDesc.value,
      catByName: categories
    });
  } else {
    // EDITION.
    g_currentArticle.id = inpId.value;
    g_currentArticle.title = inpTitle.value;
    g_currentArticle.desc = inpDesc.value;
    g_currentArticle.cat = Data.name2idx( categories );
    Data.save();
  }
  location = "#search";
};


exports.onDeleteArticle = function() {
  if( typeof g_currentArticle === 'undefined' ) return;
  Modal.confirm({
    title: _("delete"),
    content: [
      $.tag("br"),
      $.tag("br"),
      $.tag("b", [g_currentArticle.title]),
      $.div("desc", [g_currentArticle.desc])
    ],
    yes: _("confirm-delete"),
    onYes: function() {
      Data.deleteArticle( g_currentArticle.id );
      location = "#search";
      Msg( _("delete-done", g_currentArticle.title) );
    }
  });
};


exports.onNewCategory = function( category ) {
  category = ("" + category).trim().toLowerCase();
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
  if( Data.countArticles() === 0 ) {
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
  if( articles.length === 0 ) {
    $.add( "result", _('found-nothing') );
    return;
  }
  console.info("[main] articles=", articles);
  articles.forEach(function (art, index) {
    var btnEdit = new Button({
      flat: true, icon: "edit"
    });
    btnEdit.on(function() {
      location = "#add/" + art.id;
    });
    if( index > 0 ) {
      $.add( "result", $.tag("hr") );
    }
    $.add(
      "result",
      $.div([
        $.div([
          $.div( "id", [art.id] ),
          $.div( "title", [art.title] ),
          $.div( "desc", [art.desc] )
        ]),
        $.div([ btnEdit ])
      ])
    );
  });
}


/**
 * Initialiser la page d'ajout d'article.
 */
function initAdd( id ) {
  g_currentArticle = undefined;
  if( typeof id !== 'undefined' ) {
    g_currentArticle = Data.getArticle( id );
  }

  W("add.categories").value = [];
  if( typeof g_currentArticle === 'undefined' ) {
    // Mode AJOUT.
    W("add.id").value = Data.getFreeId();
    W("add.title").value = "";
    W("add.desc").value = "";
    $("add.header").textContent = _("add");
    W("add.delete").visible = false;
  } else {
    // Mode EDITION.
    W("add.id").value = g_currentArticle.id;
    W("add.title").value = g_currentArticle.title;
    W("add.desc").value = g_currentArticle.desc;
    W("add.categories").value = Data.idx2name( g_currentArticle.cat );
    $("add.header").textContent = _("edit");
    W("add.delete").visible = true;
  }
  W("add.categories").list = Data.getCategories();

  W("add.title").focus = true;
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

  if( typeof g_currentArticle !== 'undefined' ) {
    // Mode EDITION.
    // Si l'id n'a pas été modifié, inutile de le vérifier.
    if( id == g_currentArticle.id ) return true;
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
