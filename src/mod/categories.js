/**
 * @class Categories
 * @param {array} list - List of category's names.
 * @param {array} value - List of selected categories.
 */

"use strict";

var $ = require( "dom" );
var DB = require( "tfw.data-binding" );
var Tools = require("tools");
var Checkbox = require("wdg.checkbox");

require("tfw.binding.array");

var Categories = function( opts ) {
  var that = this;

  var elem = $.elem( this, 'div', 'categories' );

  DB.propStringArray( this, 'list' )(function( v ) {
    $.clear( elem );
    v.forEach(function (category) {
      var wdg = new Checkbox({
        wide: true,
        inverted: true,
        text: category,
        value: that.value.indexOf( category ) != -1
      });
      $.add( elem, wdg );
      DB.bind( wdg, 'value', function(v) {
        if( v ) {
          if( that.value.indexOf( category ) === -1 ) {
            that.value.push( category );
            DB.fire( that, 'value' );
          }
        } else {
          if( that.value.indexOf( category ) !== -1 ) {            
            that.value = that.value.filter(function(itm) {
              return itm != category;
            });
            DB.fire( that, 'value' );
          }
        }
      });
    });
  });
  DB.propStringArray( this, 'value' )(function( v ) {

  });

  opts = DB.extend({
    list: [],
    value: []
  }, opts, this);
};


module.exports = Categories;


Categories.prototype.addCategory = function( category, selected ) {
  if( this.list.indexOf( category ) === -1 ) {
    if( selected ) this.value.push( category );
    this.list.push( category );
    DB.fire( this, 'list' );
  }
};
