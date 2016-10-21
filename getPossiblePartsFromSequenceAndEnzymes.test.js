var chai = require("chai");
var should = chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
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
        parts[0].start.should.equal(29)
        parts[0].end.should.equal(76)
        parts[0].firstCutOffset.should.equal(4)
        parts[0].firstCutOverhang.should.equal('gatc')
        parts[0].secondCutOffset.should.equal(4)
        parts[0].secondCutOverhang.should.equal('gatc')

        parts[1].start.should.equal(73)
        parts[1].end.should.equal(32)
    });
    it('cuts using two golden gate enzymes', function() {
        var sequence = {
                //                sapi ->                                                       
            sequence: 'tggttgtagtGCTCTTCagttagttgatgttatagggatcctgtagtatttatgtagtaGGAGACCtatgatgtagggtcatcagtagtagtggatcctattatatata',
                //     accaacatcacgagaagtcaatcaactacaatatccctaggacatcataaatacatcatcctctggatactacatcCCAGAGtcatcatcacctaggataatatatat
                //                                                                 <- bsai
            circular: true
        }
        var parts = getPossiblePartsFromSequenceAndEnzymes(sequence, [enzymeList['sapi'],enzymeList['bsai']]);
        parts.length.should.equal(2)
        parts.should.containSubset([
        { 
            start: 18,
            end: 58,
            firstCut: 
             { start: 10,
               end: 20,
               topSnipPosition: 18,
               bottomSnipPosition: 21,
               topSnipBeforeBottom: true,
               overhangBps: 'gtt',
               upstreamTopBeforeBottom: false,
               upstreamTopSnip: null,
               upstreamBottomSnip: null,
               forward: true,
            },
            firstCutOffset: 3,
            firstCutOverhang: 'gtt',
            firstCutOverhangTop: 'gtt',
            firstCutOverhangBottom: '',
            secondCut: 
             { start: 55,
               end: 65,
               topSnipPosition: 55,
               bottomSnipPosition: 59,
               topSnipBeforeBottom: true,
               overhangBps: 'agta',
               upstreamTopBeforeBottom: false,
               upstreamTopSnip: null,
               upstreamBottomSnip: null,
               forward: false,
            },
            secondCutOffset: 4,
            secondCutOverhang: 'agta',
            secondCutOverhangTop: '',
            secondCutOverhangBottom: 'tcat' 
        },
        { 
            start: 55,
            end: 20,
            firstCut: 
             { start: 55,
               end: 65,
               topSnipPosition: 55,
               bottomSnipPosition: 59,
               topSnipBeforeBottom: true,
               overhangBps: 'agta',
               upstreamTopBeforeBottom: false,
               upstreamTopSnip: null,
               upstreamBottomSnip: null,
               forward: false,
            },
            firstCutOffset: 4,
            firstCutOverhang: 'agta',
            firstCutOverhangTop: 'agta',
            firstCutOverhangBottom: '',
            secondCut: 
             { start: 10,
               end: 20,
               topSnipPosition: 18,
               bottomSnipPosition: 21,
               topSnipBeforeBottom: true,
               overhangBps: 'gtt',
               upstreamTopBeforeBottom: false,
               upstreamTopSnip: null,
               upstreamBottomSnip: null,
               forward: true,
            },
            secondCutOffset: 3,
            secondCutOverhang: 'gtt',
            secondCutOverhangTop: '',
            secondCutOverhangBottom: 'caa' 
        } 
        ])
    });
})