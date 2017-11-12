"use strict";

var REPLACEMENTS = [
  [ "áàâäã", "a"  ],
  [ "ç",     "c"  ],
  [ "éèêëẽ", "e"  ],
  [ "íìîïĩ", "i"  ],
  [ "óòôöõ", "o"  ],
  [ "úùûüũ", "u"  ],
  [ "ñ",     "n"  ],
  [ "ß",     "ss" ]
];

exports.toSearchableString = function( text ) {
  text = text.trim().toLowerCase();
  var output = '';
  var index = 0;
  var cursor = 0;
  var char, i, replacement, from, to;

  while( index < text.length ) {
    char = text.charAt( index );
    for( i = 0 ; i < REPLACEMENTS.length ; i++ ) {
      replacement = REPLACEMENTS[i];
      from = replacement[0];
      to = replacement[1];
      if( from.indexOf( char ) !== -1 ) {
        output += text.substr( cursor, index - cursor ) + to;
        cursor = index + 1;
        break;
      }
    }
    index++;
  }

  output += text.substr( cursor );
  return output;
};
