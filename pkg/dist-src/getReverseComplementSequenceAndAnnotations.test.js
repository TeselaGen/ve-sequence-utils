import chai from 'chai';
chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import getReverseComplementSequenceAndAnnotations from "./getReverseComplementSequenceAndAnnotations.js";
describe("getReverseComplementSequenceAndAnnotations", function () {
  it("reverse complements an annotation ", function () {
    const newSeq = getReverseComplementSequenceAndAnnotations({
      sequence: "aaatttcccg",
      circular: true,
      features: [{
        start: 3,
        end: 5
      }, {
        start: 8,
        end: 2
      }]
    });
    newSeq.should.containSubset({
      sequence: "cgggaaattt",
      features: [{
        start: 4,
        end: 6,
        forward: true
      }, {
        start: 7,
        end: 1,
        forward: true
      }]
    });
  });
  it("handles a range option correctly and reverse complements a subset of the sequnce ", function () {
    const newSeq = getReverseComplementSequenceAndAnnotations({
      sequence: "aaatttcccgttt",
      circular: true,
      features: [{
        start: 3,
        end: 5
      }]
    }, {
      range: {
        start: 0,
        end: 9
      }
    });
    newSeq.should.containSubset({
      sequence: "cgggaaattt",
      features: [{
        start: 4,
        end: 6,
        forward: true
      }]
    });
  });
});