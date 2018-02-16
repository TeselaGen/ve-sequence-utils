const generateSequenceData = require('./generateSequenceData')
const chai = require("chai");
const { getRangeLength } = require("ve-range-utils");

chai.should();
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

describe('generateSequenceData', function() {
    it('should generate some nice random data', function() {
      generateSequenceData({sequenceLength: 100}).sequence.length.should.equal(100)
    })
})