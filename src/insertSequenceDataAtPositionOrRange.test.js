//tnr: half finished test.
// let tap = require('tap');
// tap.mochaGlobals();
import chai from 'chai';

import { getRangeLength } from 've-range-utils';

chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);

import insertSequenceDataAtPositionOrRange from './insertSequenceDataAtPositionOrRange';

describe("insertSequenceData", function() {
  it("inserts protein and dna characters at correct caret", function() {
    let sequenceToInsert = {
      sequence: "atagatagg",
      proteinSequence: "IDR"
    };
    let sequenceToInsertInto = {
      //  012345
      sequence: "atgagagagaaa",
      proteinSequence: "MREK"
    };
    let caret = 3;
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      caret
    );
    postInsertSeq.sequence.should.equal("atgatagataggagagagaaa");
    postInsertSeq.proteinSequence.should.equal("MIDRREK");
  });
  it("inserts protein and dna characters at correct range", function() {
    let sequenceToInsert = {
      sequence: "atagatagg",
      proteinSequence: "IDR"
    };
    let sequenceToInsertInto = {
      //  012345
      sequence: "atgagagagaaa",
      proteinSequence: "MREK"
    };
    let range = { start: 3, end: 5 };
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      range
    );
    postInsertSeq.sequence.should.equal("atgatagatagggagaaa");
    postInsertSeq.proteinSequence.should.equal("MIDREK");
  });
  it("inserts characters at correct range", function() {
    let sequenceToInsert = {
      sequence: "rrrrrrr"
    };
    let sequenceToInsertInto = {
      sequence: "atgagagaga"
    };
    let range = { start: 3, end: 5 };
    let postInsertSeq = insertSequenceDataAtPositionOrRange(
      sequenceToInsert,
      sequenceToInsertInto,
      range
    );
    postInsertSeq.sequence.should.equal("atgrrrrrrrgaga");
    postInsertSeq.sequence.length.should.equal(
      sequenceToInsertInto.sequence.length +
        sequenceToInsert.sequence.length -
        getRangeLength(range)
    );
  });
  it("inserts characters at correct range, and doesn't clobber other properties on the existing sequence data", function() {
    let sequenceToInsert = {
      sequence: "atgagagaga"
    };
    let sequenceToInsertInto = {
      sequence: "atagatag",
      name: "thomasDaMan!",
      circular: true
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
    postInsertSeq.name.should.equal("thomasDaMan!");
    postInsertSeq.circular.should.equal(true);
  });
  it("inserts characters at correct caret position", function() {
    let sequenceToInsert = {
      sequence: "atgagagaga"
    };
    let sequenceToInsertInto = {
      sequence: "g"
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
