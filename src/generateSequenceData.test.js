import generateSequenceData from './generateSequenceData';
import chai from 'chai';
import chaiSubset from 'chai-subset';

chai.should();
chai.use(chaiSubset);

describe('generateSequenceData', function() {
    it('should generate some nice random data', function() {
      generateSequenceData({sequenceLength: 100}).sequence.length.should.equal(100)
    })
})