const { translateRange, getSequenceWithinRange } = require("ve-range-utils");
let revComp = require("./getReverseComplementSequenceString");
let getAA = require("./getAminoAcidFromSequenceTriplet");
// var ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
/**
 * @private
 * Gets aminoAcid data, including position in string and position in codon
 * from the sequenceString and the direction of the translation
 * @param  {String} sequenceString The dna sequenceString.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return [{
        aminoAcid: 
        positionInCodon: 
      }]
 */
module.exports = function getAminoAcidDataForEachBaseOfDna(
  originalSequenceString,
  forward,
  optionalSubrangeRange
) {
  let sequenceString = originalSequenceString;
  let startOffset = 0;
  if (optionalSubrangeRange) {
    sequenceString = getSequenceWithinRange(
      optionalSubrangeRange,
      originalSequenceString
    );
    startOffset = optionalSubrangeRange.start;
  }

  // ac.throw([ac.string,ac.bool],arguments);
  let aminoAcidDataForEachBaseOfDNA = [];
  let codonRange;
  let revCompGapLength = 0;
  let aminoAcidIndex = 0;
  if (!forward) {
    //compute the start of the amino acid sequence, but only if translating in the reverse direction
    aminoAcidIndex = Math.floor((sequenceString.length - 1) / 3);
    //because we're translating in the reverse direction, we need to
    //check to see if there are untranslated amino acids at the start of the sequenceString
    revCompGapLength = sequenceString.length % 3;
    codonRange = translateRange(
      {
        start: 0,
        end: revCompGapLength - 1
      },
      startOffset,
      originalSequenceString.length
    );

    if (revCompGapLength > 0) {
      for (let i = 0; i < revCompGapLength; i++) {
        aminoAcidDataForEachBaseOfDNA.push({
          aminoAcid: getAA("xxx"), //fake xxx triplet returns the gap amino acid
          positionInCodon: revCompGapLength - i - 1,
          aminoAcidIndex,
          sequenceIndex: codonRange.start + i,
          codonRange,
          fullCodon: false
        });
      }
      aminoAcidIndex--;
    }
  }

  //compute the bulk of the sequence
  for (
    let index = 2 + revCompGapLength;
    index < sequenceString.length;
    index += 3
  ) {
    let triplet = sequenceString.slice(index - 2, index + 1);
    if (!forward) {
      //we reverse the triplet
      triplet = revComp(triplet);
    }
    let aminoAcid = getAA(triplet);
    codonRange = translateRange(
      {
        start: index - 2,
        end: index
      },
      startOffset,
      originalSequenceString.length
    );

    aminoAcidDataForEachBaseOfDNA.push({
      aminoAcid, //gap amino acid
      positionInCodon: forward ? 0 : 2,
      aminoAcidIndex,
      sequenceIndex: codonRange.start,
      codonRange,
      fullCodon: true
    });
    aminoAcidDataForEachBaseOfDNA.push({
      aminoAcid, //gap amino acid
      positionInCodon: 1,
      aminoAcidIndex,
      sequenceIndex: codonRange.start + 1,
      codonRange,
      fullCodon: true
    });
    aminoAcidDataForEachBaseOfDNA.push({
      aminoAcid, //gap amino acid
      positionInCodon: forward ? 2 : 0,
      aminoAcidIndex,
      sequenceIndex: codonRange.start + 2,
      codonRange,
      fullCodon: true
    });
    if (forward) {
      aminoAcidIndex++;
    } else {
      aminoAcidIndex--;
    }
  }

  //compute the end of the sequence
  //we'll never hit the following logic if translating in the reverse direction
  let lengthOfEndBpsNotCoveredByAminoAcids =
    sequenceString.length - aminoAcidDataForEachBaseOfDNA.length;
  codonRange = translateRange(
    {
      start: sequenceString.length - lengthOfEndBpsNotCoveredByAminoAcids,
      end: sequenceString.length - 1
    },
    startOffset,
    originalSequenceString.length
  );
  for (let j = 0; j < lengthOfEndBpsNotCoveredByAminoAcids; j++) {
    aminoAcidDataForEachBaseOfDNA.push({
      aminoAcid: getAA("xxx"), //fake xxx triplet returns the gap amino acid
      positionInCodon: j,
      aminoAcidIndex,
      sequenceIndex: codonRange.start + j,
      fullCodon: false,
      codonRange
    });
  }

  if (sequenceString.length !== aminoAcidDataForEachBaseOfDNA.length) {
    throw new Error("something went wrong!");
  }
  return aminoAcidDataForEachBaseOfDNA;
};
