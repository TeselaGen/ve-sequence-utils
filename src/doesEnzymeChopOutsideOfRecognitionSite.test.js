// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
chai.should();
var doesEnzymeChopOutsideOfRecognitionSite = require("./doesEnzymeChopOutsideOfRecognitionSite.js");
var enzymeList = require("./enzymeList");

describe("doesEnzymeChopOutsideOfRecognitionSite", function() {
  //bamhi
  // "bamhi": {
  //     "name": "bamhi",
  //     "site": "ggatcdc",
  //     "forwardRegex": "g{2}atc{2}",
  //     "reverseRegex": "g{2}atc{2}",
  //     "topSnipOffset": 1,
  //     "bottomSnipOffset": 5
  // },
  // ATGATCAGA
  // 012345678
  it("should return a result for every enzyme", function() {
    Object.keys(enzymeList).map(function(key) {
      doesEnzymeChopOutsideOfRecognitionSite(enzymeList[key]);
    });
  });
  it("knows which enzymes chop within the recognition site", function() {
    doesEnzymeChopOutsideOfRecognitionSite(enzymeList["bamhi"]).should.equal(
      false
    );
    doesEnzymeChopOutsideOfRecognitionSite(enzymeList["xhoi"]).should.equal(
      false
    );

    doesEnzymeChopOutsideOfRecognitionSite(enzymeList["bsmbi"]).should.equal(
      true
    );
    doesEnzymeChopOutsideOfRecognitionSite(enzymeList["bsai"]).should.equal(
      true
    );
  });
});
