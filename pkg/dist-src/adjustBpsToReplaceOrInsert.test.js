//tnr: half finished test.
// let tap = require('tap');
// tap.mochaGlobals();
import chai from 'chai';
chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import adjustBpsToReplaceOrInsert from "./adjustBpsToReplaceOrInsert.js";
describe("adjustBpsToReplaceOrInsert", function () {
  it("inserts characters at correct caret position", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", 0).should.equal("xxxtttgggaaaccc");
  });
  it("inserts characters at correct caret position", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", 3).should.equal("tttxxxgggaaaccc");
  });
  it("inserts characters at correct caret position", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", 12).should.equal("tttgggaaacccxxx");
  });
  it("inserts characters at correct range 0 0", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", {
      start: 0,
      end: 0
    }).should.equal("xxxttgggaaaccc");
  });
  it("inserts characters at correct range 11 11", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", {
      start: 11,
      end: 11
    }).should.equal("tttgggaaaccxxx");
  });
  it("inserts characters at correct range 11 0", function () {
    adjustBpsToReplaceOrInsert("tttgggaaaccc", "xxx", {
      start: 11,
      end: 0
    }).should.equal("xxxttgggaaacc");
  });
});