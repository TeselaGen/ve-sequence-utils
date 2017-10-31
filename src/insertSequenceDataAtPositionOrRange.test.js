//tnr: half finished test.
// let tap = require('tap');
// tap.mochaGlobals();
const chai = require("chai");
const { getRangeLength } = require("ve-range-utils");

chai.should();
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const insertSequenceDataAtPositionOrRange = require("./insertSequenceDataAtPositionOrRange");

describe("insertSequenceData", function() {
  it("inserts characters at correct range", function() {
    let sequenceToInsert = {
      sequence: "atgagagaga"
    };
    let sequenceToInsertInto = {
      sequence: "atagatag"
    };
    let range = { start: 3, end: 5 };
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      range
    );
    postInsertSeq.sequence.length.should.equal(
      sequenceToInsertInto.sequence.length +
        sequenceToInsert.sequence.length -
        getRangeLength(range)
    );
  });
  it("inserts characters at correct caret position", function() {
    let sequenceToInsert = {
      sequence: "atgagagaga"
    };
    let sequenceToInsertInto = {
      sequence: "0"
    };
    let caretPosition = 0;
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      caretPosition
    );
    postInsertSeq.sequence.length.should.equal(
      sequenceToInsertInto.sequence.length + sequenceToInsert.sequence.length
    );
  });
  it("inserts characters at correct caret position", function() {
    let sequenceToInsert = {
      sequence: "atgagagaga"
    };
    let sequenceToInsertInto = {
      sequence: "atgagagaga",
      features: [{ start: 0, end: 9 }]
    };
    let caretPosition = 0;
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      caretPosition
    );
    postInsertSeq.sequence.length.should.equal(
      sequenceToInsertInto.sequence.length + sequenceToInsert.sequence.length
    );
    postInsertSeq.features.length.should.equal(1);
    postInsertSeq.features[0].start.should.equal(
      sequenceToInsertInto.features[0].start + sequenceToInsert.sequence.length
    );
  });
});
