//tnr: half finished test.
// const tap = require('tap');
// tap.mochaGlobals();
import chai from 'chai';
chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import tidyUpSequenceData from "./tidyUpSequenceData.js";
import insertSequenceDataAtPosition from "./insertSequenceDataAtPosition.js";
describe("insertSequenceData", function () {
  it("inserts characters at correct caret position", function () {
    let seqToInsert = {
      sequence: "atgagagaga"
    };
    let preInsertSeq = {
      sequence: "0"
    };
    seqToInsert = tidyUpSequenceData(seqToInsert);
    const caretPosition = 0;
    preInsertSeq = tidyUpSequenceData({});
    const postInsertSeq = insertSequenceDataAtPosition(seqToInsert, preInsertSeq, caretPosition);
    postInsertSeq.sequence.length.should.equal(preInsertSeq.sequence.length + seqToInsert.sequence.length);
  });
  it("inserts characters at correct caret position", function () {
    let seqToInsert = {
      sequence: "atgagagaga"
    };
    let preInsertSeq = {
      sequence: "atgagagaga",
      features: [{
        start: 0,
        end: 9,
        locations: [{
          start: 0,
          end: 3
        }, {
          start: 5,
          end: 9
        }]
      }]
    };
    seqToInsert = tidyUpSequenceData(seqToInsert);
    preInsertSeq = tidyUpSequenceData(preInsertSeq);
    const caretPosition = 0;
    const postInsertSeq = insertSequenceDataAtPosition(seqToInsert, preInsertSeq, caretPosition);
    postInsertSeq.sequence.length.should.equal(preInsertSeq.sequence.length + seqToInsert.sequence.length);
    postInsertSeq.features.length.should.equal(1);
    postInsertSeq.features[0].start.should.equal(preInsertSeq.features[0].start + seqToInsert.sequence.length);
    postInsertSeq.features[0].locations[0].start.should.equal(preInsertSeq.features[0].locations[0].start + seqToInsert.sequence.length);
    postInsertSeq.features[0].locations[1].start.should.equal(preInsertSeq.features[0].locations[1].start + seqToInsert.sequence.length);
    postInsertSeq.features[0].locations[0].end.should.equal(preInsertSeq.features[0].locations[0].end + seqToInsert.sequence.length);
    postInsertSeq.features[0].locations[1].end.should.equal(preInsertSeq.features[0].locations[1].end + seqToInsert.sequence.length);
  });
});