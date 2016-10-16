var chai = require("chai");
var should = chai.should();
var getPossiblePartsFromSequenceAndEnzymes = require('./getPossiblePartsFromSequenceAndEnzymes');
var enzymeList = require('./enzymeList.json');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
describe('cutting using a single simple palindromic enzyme', function() {
    //bamhi
    // "bamhi": {
    //     "name": "bamhi",
    //     "site": "ggatcc",
    //     "forwardRegex": "g{2}atc{2}",
    //     "reverseRegex": "g{2}atc{2}",
    //     "topSnipOffset": 1,
    //     "bottomSnipOffset": 5,
    //     "usForward": 0,
    //     "usReverse": 0
    // },
    it('cuts a single non-circular cutsite', function() {
        var sequence = {
            sequence: 'tggttgtagtagttagttgatgttatagggatcctgtagtatttatgtagtagtatgatgtagagtagtagtggatcctattatatata',
            circular: true
        }
        var parts = getPossiblePartsFromSequenceAndEnzymes(sequence, [enzymeList['bamhi']]);
        parts.should.be.an.array
        parts.length.should.equal(2)
        console.log('parts:', parts)
        parts[0].start.should.equal(29)
        parts[0].end.should.equal(72)
        // parts[0].firstCut.should.equal(12)
        // parts[0].//the.should.equal(12)
        parts[0].firstCutOffset.should.equal(4)
        parts[0].firstCutOverhang.should.equal('gatc')
        // parts[0].secondCut.should.equal(12)
        // parts[0].//the.should.equal(12)
        parts[0].secondCutOffset.should.equal(4)
        parts[0].secondCutOverhang.should.equal('gatc')
    });
})