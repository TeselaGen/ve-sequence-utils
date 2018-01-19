const chai = require("chai");
chai.should();
const guessIfSequenceIsDnaAndNotProtein = require('./guessIfSequenceIsDnaAndNotProtein')
describe('guessIfSequenceIsDnaAndNotProtein', function() {
    it('should correctly guess that a DNA seq is DNA', function() {
        guessIfSequenceIsDnaAndNotProtein("gtatacc").should.equal(true)
    })
    it('should correctly guess that a DNA seq with some ambiguity is a DNA', function() {
        guessIfSequenceIsDnaAndNotProtein("gtatacctaacn").should.equal(true)
    })
    it('should correctly guess that a seq with lots of ambiguity is a protein', function() {
        guessIfSequenceIsDnaAndNotProtein("gtatacybctaacn").should.equal(false)
    })
    it('should correctly guess that a DNA with lots of ambiguities is dna when the threshold is lower  ', function() {
      guessIfSequenceIsDnaAndNotProtein("gtatacybctaacn", {
          threshold: .5
      }).should.equal(true)
    })
    it('should correctly guess that a DNA with lots of ambiguity is a dna when the ambiguous letter is included ', function() {
        guessIfSequenceIsDnaAndNotProtein("gtatanccnnntaacn", {dnaLetters: ["g",'a', 't', 'c', 'n']}).should.equal(true)
    })
})