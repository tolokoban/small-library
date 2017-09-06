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


exports.countArticles = function() {
  return g_data.art.length;
};


/**
 * Retourner une copie  de la liste des  catégories disponibles, triée
 * par ordre alphabétique.
 */
exports.getCategories = function() {
  var cat = g_data.cat.slice();
  cat.sort();
  return cat;
};


exports.getFreeId = function() {
  return "" + (g_data.id + 1);
};


exports.deleteArticle = function( id ) {
  var idx = g_data.art.findIndex(function( art ) {
    return art.id == id;
  });
  if( idx === -1 ) return false;
  g_data.art.splice( idx, 1 );
  exports.save();
  return true;
};


/**
 * Retourner un  tableau de noms  de catégories à partir  d'un tableau
 * d'index de catégories.
 * @param {array} list - Tableau d'index de catégories.
 */
exports.idx2name = function( list ) {
  return list.map(function( idx ) {
    return g_data.cat[idx];
  }).filter(function( itm ) {
    // Ignorer les index inexistants.
    return typeof itm !== 'undefined';
  });
};


/**
 * Retourner un tableau d'index de catégories à partir d'un tableau de
 * noms de catégories.
 * @param {array} list - Tableau de noms de catégories.
 */
exports.name2idx = function( list ) {
  return list.map(function( name ) {
    return g_data.cat.indexOf( name );
  }).filter(function( itm ) {
    // Ignorer les noms inexistants pour lesquels `indexOf` retourne -1.
    return typeof itm != -1;
  });
};


/**
 * Ajouter un nouvel article.
 * @param {string} newArt.id.
 * @param {string} newArt.title.
 * @param {string} newArt.desc.
 * @param {array}  newArt.cat  -  tableau  des  noms  des  catégories
 * associées à cet article.
 */
exports.addArticle = function( newArt ) {
  // On a des  noms de catégories, mais pour compresser  un peu, on ne
  // va garder que les index de ces catégories.
  var cat = [];
  newArt.catByName.forEach(function (name) {
    var idx = g_data.cat.indexOf( name );
    if( idx > -1 ) {
      cat.push( idx );
      return;
    }
    // On n'a pas trouvé la catégorie,  il faut donc la rajouter. Dans
    // le futur,  on essaiera peut-être  de trouver la  catégorie dont
    // l'orthographe  ressemble le  plus pour  éviter les  doublons de
    // catégories.
    idx = g_data.cat.length;
    g_data.cat.push( name );
    cat.push( idx );
  });
  // Incrémenter le générateur d'identifiants.
  g_data.id++;
  // Ajouter le nouvel article à la base de données.
  g_data.art.push({
    id: newArt.id,
    title: newArt.title,
    desc: newArt.desc,
    cat: cat
  });
  // Sauvegarde.
  exports.save();
};


/**
 * Retourner l'article dont l'identifiant est `id`.
 * S'il n'existe pas, retourner undefined.
 */
exports.getArticle = function( id ) {
  return g_data.art.find(function( art ) {
    return art.id == id;
  });
};


exports.findArticles = function( categories ) {
  var cat = [];
  categories.forEach(function (name) {
    var idx = g_data.cat.indexOf( name );
    if( idx > -1 ) cat.push( idx );
  });
  // Retourner seulement les articles qui ont toutes les catégories.
  return g_data.art.filter(function( art ) {
    var score = 0;
    cat.forEach(function (idx) {
      if( art.cat.indexOf( idx ) > -1 ) score++;
    });
    if( score == cat.length ) return true;
    return false;
  });
};

/**
 * Vérifie s'il existe ou non un article avec l'identifiant `id`.
 */
exports.exists = function( id ) {
  return false;
};


exports.save = function() {
  Local.set( "small-library", g_data );
};
