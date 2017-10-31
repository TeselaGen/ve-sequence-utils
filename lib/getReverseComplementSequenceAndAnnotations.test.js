var chai = require("chai");
var should = chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
var getReverseComplementSequenceAndAnnotations = require('./getReverseComplementSequenceAndAnnotations');
describe('getReverseComplementSequenceAndAnnotations', function () {
    it('reverse complements an annotation ', function () {
        var newSeq = getReverseComplementSequenceAndAnnotations({
            sequence: 'aaatttcccg',
            circular: true,
            features: [{
              start: 3,
              end:5
            },{
              start: 8,
              end:2
            }]
        })
        newSeq.should.containSubset({
          sequence: 'cgggaaattt',
          features: [{
            start: 4,
            end: 6,
            forward: true
          },{
            start: 7,
            end: 1,
            forward: true
          }]
        })
    });
});