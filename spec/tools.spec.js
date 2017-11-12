"use strict";

describe('tools', function() {
  var Tools = require("tools");
  describe('toSearchableString()', function() {
    var check = function( from, to ) {
      it('should turn "' + from + '" into "' + to + '"', function() {
        expect( Tools.toSearchableString( from ) ).toBe( to );
      });
    };
    check("Arbre", "arbre");
    check("   cHIen ", "chien");
    check("Fièvre jaune", "fievre jaune");
    check("straße", "strasse");
    check("garçon", "garcon");
    check("éveil", "eveil");
    check("étêté", "etete");
/*
    check("c'est l'été", "c'est l'ete");
    check("créée", "creee");
    check("niño", "nino");
*/
  });
});
