// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
var should = chai.should();
var cutSequenceByRestrictionEnzyme = require("./cutSequenceByRestrictionEnzyme.js");
var enzymeList = require("./enzymeList");
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
describe("a simple, palindromic enzyme", function() {
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
  it("cuts on the reverse strand and the recognition site wraps the origin", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "gcatccagagagagagagagagagagagagaaga",
      true,
      enzymeList["sapi"]
    );
    // console.log('cutsites:', cutsites)
    // cutsites.should.be.an.array;
    // cutsites.length.should.equal(1);
    // cutsites[0].start.should.equal(0);
    // cutsites[0].end.should.equal(5);
    // cutsites[0].recognitionSiteRange.start.should.equal(0);
    // cutsites[0].recognitionSiteRange.end.should.equal(5);
    // cutsites[0].topSnipPosition.should.equal(1);
    // cutsites[0].bottomSnipPosition.should.equal(5);
    // cutsites[0].topSnipBeforeBottom.should.equal(true);
    // should.not.exist(cutsites[0].upstreamTopSnip);
    // should.not.exist(cutsites[0].upstreamBottomSnip);
  });
  it("cuts a single non-circular cutsite", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ggatcc",
      true,
      enzymeList["bamhi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(0);
    cutsites[0].end.should.equal(5);
    cutsites[0].recognitionSiteRange.start.should.equal(0);
    cutsites[0].recognitionSiteRange.end.should.equal(5);
    cutsites[0].topSnipPosition.should.equal(1);
    cutsites[0].bottomSnipPosition.should.equal(5);
    cutsites[0].topSnipBeforeBottom.should.equal(true);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
  });
  it("cuts a single circular cutsite", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ccrrrrggat",
      true,
      enzymeList["bamhi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(6);
    cutsites[0].end.should.equal(1);
    cutsites[0].recognitionSiteRange.start.should.equal(6);
    cutsites[0].recognitionSiteRange.end.should.equal(1);
    cutsites[0].topSnipPosition.should.equal(7);
    cutsites[0].bottomSnipPosition.should.equal(1);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
  });
  it("does not cut a circular cutsite if sequence is non-circular", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ccrrrrggat",
      false,
      enzymeList["bamhi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(0);
  });
  it("cuts multiple times", function() {
    //bamhi
    // "bamhi": {
    //     "name": "bamhi",
    //     "site": "ggatcdc",
    //     "forwardRegex": "g{2}atc{2}",
    //     "reverseRegex": "g{2}atc{2}",
    //     "topSnipOffset": 1,
    //     "bottomSnipOffset": 5
    // },
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ggatccttttggatcc",
      true,
      enzymeList["bamhi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(2);
    cutsites[0].start.should.equal(0);
    cutsites[0].end.should.equal(5);
    cutsites[0].recognitionSiteRange.start.should.equal(0);
    cutsites[0].recognitionSiteRange.end.should.equal(5);
    cutsites[0].topSnipPosition.should.equal(1);
    cutsites[0].bottomSnipPosition.should.equal(5);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
    cutsites[1].start.should.equal(10);
    cutsites[1].end.should.equal(15);
    cutsites[1].recognitionSiteRange.start.should.equal(10);
    cutsites[1].recognitionSiteRange.end.should.equal(15);
    cutsites[1].topSnipPosition.should.equal(11);
    cutsites[1].bottomSnipPosition.should.equal(15);
    should.not.exist(cutsites[1].upstreamTopSnip);
    should.not.exist(cutsites[1].upstreamBottomSnip);
  });
  it("it does not get into an infinite loop if the enzyme's forward/reverse regex are empty strings", function() {
    // ttttttttttttttttttttrccggyttttttttttttttttttttt
    // 01234567890123456789012345678901234567890123456
    var cutsites = cutSequenceByRestrictionEnzyme(
      "rccggyttttttttttttttttttttt",
      false,
      {
        name: "fake enzyme",
        site: "ccgcgg",
        forwardRegex: "",
        reverseRegex: "",
        topSnipOffset: 1,
        bottomSnipOffset: 1
      }
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(0);
    cutsites.error.should.not.be.null;
    cutsites.error.should.equal(
      "Cannot cut sequence. Enzyme restriction site must be at least 1 bp long."
    );
  });
});
describe("non-palindromic enzyme", function() {
  // "bsmbi": {
  //     "name": "BsmBI",
  //     "site": "cgtctc",
  //     "forwardRegex": "cgtctc",
  //     "reverseRegex": "gagacg",
  //     "topSnipOffset": 7,
  //     "bottomSnipOffset": 11
  // },
  //
  it("does not cut if the enzyme cuts outside of a linear sequence", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "cgtctc",
      false,
      enzymeList["bsmbi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(0);
  });
  it("does cut if the enzyme fits within circular sequence", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "cgtctc",
      true,
      enzymeList["bsmbi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(0);
    cutsites[0].end.should.equal(4);
    cutsites[0].recognitionSiteRange.start.should.equal(0);
    cutsites[0].recognitionSiteRange.end.should.equal(5);
    cutsites[0].topSnipPosition.should.equal(1);
    cutsites[0].bottomSnipPosition.should.equal(5);
    should.not.exist(cutsites[0].upstreamTopSnip);
  });
  it("does cut if the sequence is long enough", function() {
    // 0123456 7890 12345678
    // cgtctct tttt tttttttttttttttttt
    // rrrrrr
    //        |  dsTopSnip
    //             |  dsBottomSnip
    var cutsites = cutSequenceByRestrictionEnzyme(
      "cgtctcttttttttttttttttttttttt",
      true,
      enzymeList["bsmbi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(0);
    cutsites[0].end.should.equal(10);
    cutsites[0].recognitionSiteRange.start.should.equal(0);
    cutsites[0].recognitionSiteRange.end.should.equal(5);
    cutsites[0].topSnipPosition.should.equal(7);
    cutsites[0].bottomSnipPosition.should.equal(11);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
  });
  it("cuts on reverse strand", function() {
    // 0123456 7890 12345678
    // cgtctct tttt tttttttttttttttttt
    // rrrrrr
    //        |  dsTopSnip
    //             |  dsBottomSnip
    var cutsites = cutSequenceByRestrictionEnzyme(
      "aaaaaaaaaaaaaaaaaaaaaaagagacg",
      true,
      enzymeList["bsmbi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(18);
    cutsites[0].end.should.equal(28);
    cutsites[0].recognitionSiteRange.start.should.equal(23);
    cutsites[0].recognitionSiteRange.end.should.equal(28);
    cutsites[0].topSnipPosition.should.equal(18);
    cutsites[0].bottomSnipPosition.should.equal(22);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
  });
});
describe("palindromic enzyme that cuts both upstream and downstream", function() {
  // "nmedi": {
  //     "name": "NmeDI",
  //     "site": "rccggy",
  //     "forwardRegex": "[agr]c{2}g{2}[cty]",
  //     "reverseRegex": "[agr]c{2}g{2}[cty]",
  //     "cutsTwice": true,
  //     "topSnipOffset": 13,
  //     "bottomSnipOffset": 18
  // },
  it("does not cut if the enzyme cuts outside of a linear sequence", function() {
    var cutsites = cutSequenceByRestrictionEnzyme(
      "rccggy",
      false,
      enzymeList["nmedi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(0);
  });
  it("does cut twice if the enzyme fits within linear sequence", function() {
    // ttttttttttttttttttttrccggyttttttttttttttttttttt
    // 01234567890123456789012345678901234567890123456
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ttttttttttttttttttttrccggyttttttttttttttttttttt",
      false,
      enzymeList["nmedi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(8);
    cutsites[0].end.should.equal(37);
    cutsites[0].recognitionSiteRange.start.should.equal(20);
    cutsites[0].recognitionSiteRange.end.should.equal(25);
    cutsites[0].topSnipPosition.should.equal(33);
    cutsites[0].bottomSnipPosition.should.equal(38);
    cutsites[0].upstreamTopSnip.should.equal(12);
    cutsites[0].upstreamBottomSnip.should.equal(7);
  });
  it("cuts only once if only the upstream cutting end fits within linear sequence", function() {
    // ttttttttttttttttttttrccggyttttttttttttttttttttt
    // 01234567890123456789012345678901234567890123456
    var cutsites = cutSequenceByRestrictionEnzyme(
      "ttttttttttttttttttttrccggy",
      false,
      enzymeList["nmedi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(8);
    cutsites[0].end.should.equal(25);
    cutsites[0].recognitionSiteRange.start.should.equal(20);
    cutsites[0].recognitionSiteRange.end.should.equal(25);
    should.not.exist(cutsites[0].topSnipPosition);
    should.not.exist(cutsites[0].bottomSnipPosition);
    cutsites[0].upstreamTopSnip.should.equal(12);
    cutsites[0].upstreamBottomSnip.should.equal(7);
  });
  it("cuts only once if only the downstream cutting end fits within linear sequence", function() {
    // ttttttttttttttttttttrccggyttttttttttttttttttttt
    // 01234567890123456789012345678901234567890123456
    var cutsites = cutSequenceByRestrictionEnzyme(
      "rccggyttttttttttttttttttttt",
      false,
      enzymeList["nmedi"]
    );
    cutsites.should.be.an.array;
    cutsites.length.should.equal(1);
    cutsites[0].start.should.equal(0);
    cutsites[0].end.should.equal(17);
    cutsites[0].recognitionSiteRange.start.should.equal(0);
    cutsites[0].recognitionSiteRange.end.should.equal(5);
    cutsites[0].topSnipPosition.should.equal(13);
    cutsites[0].bottomSnipPosition.should.equal(18);
    should.not.exist(cutsites[0].upstreamTopSnip);
    should.not.exist(cutsites[0].upstreamBottomSnip);
  });
});
