var output1 = require('./fixtures/output1.json')

// var tap = require('tap');
// tap.mochaGlobals();
var expect = require('chai').expect;
var prepareRowData = require('./index.js');
describe('prepareRowData', function() {
    it('maps overlapping annotations to rows correctly', function() {
        var annotation1 = {
            start: 0,
            end: 9,
            id: 'a'
        };
        var annotation2 = {
            start: 10,
            end: 4,
            id: 'b'
        };
        var bpsPerRow = 5;
        var sequenceData = {
          sequence: 'gagagagagagagaga',
          features: [annotation1],
          translations: [annotation1],
          parts: {'a': annotation1},
          cutsites: {'b': annotation2},
          orfs: [annotation2],
          primers: [annotation2],
        }
        var rowData = prepareRowData(sequenceData, bpsPerRow);
        expect(rowData).to.deep.equal(output1);
    });
});
