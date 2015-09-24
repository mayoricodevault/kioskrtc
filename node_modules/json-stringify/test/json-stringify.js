'use strict';

var expect = require('chai').expect;
var stringify = require('../');

describe("stringify(str, options)", function(){
  it("test indent", function(done){
    var obj = {
      a: {
        b: 1,
        c: [1, "2", 3]
      },
      d: "123"
    };

    expect(
      JSON.stringify(obj, null, 2)
    ).to.equal(
      stringify(obj, {
        indent: 2
      })
    );

    done();
  });

  it("description", function(done){
    var obj = {
      a: {
        b: 0,
        c: [1, "2", 3]
      },
      d: "123"
    };

    var sub = {
      c: ["2", 1],
      d: 3
    };

    var sub_s = stringify(sub, {
      indent: 3,
      offset: 6
    });

    var result = JSON.stringify(obj, null, 3).replace(/0/, sub_s);
    obj.a.b = sub;
    var expected = JSON.stringify(obj, null, 3);
    expect(result).to.equal(expected);
    done();
  });
});