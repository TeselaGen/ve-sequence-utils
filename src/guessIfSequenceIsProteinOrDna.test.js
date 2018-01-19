const chai = require("chai");
chai.should();
const guessIfSequenceIsProteinOrDna = require('./guessIfSequenceIsProteinOrDna')
describe('guessIfSequenceIsProteinOrDna', function() {
    it('should correctly guess that a DNA seq is DNA', function() {
        guessIfSequenceIsProteinOrDna("gtatacc").should.equal(true)
    })
    it('should correctly guess that a DNA seq with some ambiguity is a DNA', function() {
        guessIfSequenceIsProteinOrDna("gtatacctaacn").should.equal(true)
    })
    it('should correctly guess that a seq with lots of ambiguity is a protein', function() {
        guessIfSequenceIsProteinOrDna("gtatacybctaacn").should.equal(false)
    })
    it('should correctly guess that a DNA with lots of ambiguities is dna when the threshold is lower  ', function() {
      guessIfSequenceIsProteinOrDna("gtatacybctaacn", .5).should.equal(true)
    })
    it('should correctly guess that a DNA with lots of ambiguity is a dna when the ambiguous letter is included ', function() {
        guessIfSequenceIsProteinOrDna("gtatanccnnntaacn", .9, ["g",'a', 't', 'c', 'n']).should.equal(true)
    })
})