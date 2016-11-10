var tidyUpSequenceData = require('./tidyUpSequenceData');
var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.should()
describe.only('tidyUpSequenceData', function () {
    it('should add default fields to an empty sequence obj', function () {
        var res = tidyUpSequenceData({

        })
        res.should.containSubset({
            sequence: '',
            size: 0,
            circular: false,
            features: [],
            parts: [],
            translations: [],
            cutsites: [],
            orfs: [] 
        })
    });

    it('should add amino acids to a bare translation obj', function () {
        var res = tidyUpSequenceData({
            sequence: 'gtagagatagagataga',
            size: 0,
            circular: false,
            features: [],
            parts: [],
            translations: [{
                start: 0, end: 10,
            }],
            cutsites: [],
            orfs: []
        })
        // res.should.containSubset({})
        console.log('res:', res.translations[0].aminoAcids)
    });
});