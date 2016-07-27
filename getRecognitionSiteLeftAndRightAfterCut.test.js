// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
var should = chai.should();
var cutSequenceByRestrictionEnzyme = require('./cutSequenceByRestrictionEnzyme.js');
var enzymeList = require('./enzymeList.json');
var getRecognitionSiteLeftAndRightAfterCut = require('ve-range-utils/getRecognitionSiteLeftAndRightAfterCut')
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
describe('a simple, palindromic enzyme', function() {
    //bamhi
    // "bamhi": {
    //     "name": "bamhi",
    //     "site": "ggatcc",
    //     "forwardRegex": "g{2}atc{2}",
    //     "reverseRegex": "g{2}atc{2}",
    //     "cutType": 0,
    //     "dsForward": 1,
    //     "dsReverse": 5,
    //     "usForward": 0,
    //     "usReverse": 0
    // },
    it('cuts a single circular cutsite', function() {
        var sequence = 'ccrrrrggat'
        var cutsites = cutSequenceByRestrictionEnzyme(sequence, true, enzymeList['bamhi']);
        var cutsite = cutsites[0]
        var result = getRecognitionSiteLeftAndRightAfterCut(cutsite, sequence, sequence.length)
        result.leftHandSide.should.equal('g')
        result.rightHandSide.should.equal('gatcc')
        // 
        // // 
        // cutsites.should.be.an.array;
        // cutsites.length.should.equal(1);
        // cutsites[0].start.should.equal(6);
        // cutsites[0].end.should.equal(1);
        // cutsites[0].recognitionSiteRange.start.should.equal(6);
        // cutsites[0].recognitionSiteRange.end.should.equal(1);
        // cutsites[0].downstreamTopSnip.should.equal(7);
        // cutsites[0].downstreamBottomSnip.should.equal(1);
        // should.not.exist(cutsites[0].upstreamTopSnip);
        // should.not.exist(cutsites[0].upstreamBottomSnip);
    });
});
