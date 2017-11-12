"use strict";

describe('tfw.binding.array', function() {
  var MakeObservable = require("tfw.binding.array");
  it('should blablabla', function() {
    var arr = MakeObservable( [54,12,32,48] );
    arr.push( "END" );
    //expect(arr).toEqual([ 54,12,32,48,'END' ]);
    expect( arr.length ).toBe( 5 );
    expect( arr[0] ).toBe( 54 );
    expect( arr[1] ).toBe( 12 );
    expect( arr[2] ).toBe( 32 );
    expect( arr[3] ).toBe( 48 );
    expect( arr[4] ).toBe( 'END' );
  });

});
