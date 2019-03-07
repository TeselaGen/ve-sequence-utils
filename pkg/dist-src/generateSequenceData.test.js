import generateSequenceData from "./generateSequenceData.js";
import chai from 'chai';
import { getRangeLength } from 've-range-utils';
chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
describe('generateSequenceData', function () {
  it('should generate some nice random data', function () {
    generateSequenceData({
      sequenceLength: 100
    }).sequence.length.should.equal(100);
  });
});