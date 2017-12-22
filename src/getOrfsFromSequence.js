// const areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
const ObjectId = require("bson-objectid");
const getReverseComplementSequenceString = require("./getReverseComplementSequenceString");
// const ac = require('ve-api-check');
/**
 * @private
 * Finds ORFs in a given DNA forward in a given frame.
 * @param  {Int} frame The frame to look in.
 * @param  {String}sequence The dna sequence.
 * @param  {Int} minimumOrfSize The minimum length of ORF to return.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return {Teselagen.bio.orf.ORF[]} The list of ORFs found.
 */
module.exports = function getOrfsFromSequence(options) {
  // ac.throw([ac.shape({
  //     sequence: ac.string,
  //     minimumOrfSize: ac.posInt,
  //     forward: ac.bool,
  //     circular: ac.bool
  // })], arguments);

  // const frame = options.frame;
  let sequence = options.sequence;
  const minimumOrfSize = options.minimumOrfSize;
  const forward = options.forward;
  const circular = options.circular;
  const useAdditionalOrfStartCodons = options.useAdditionalOrfStartCodons;

  const originalSequenceLength = sequence.length;
  if (!forward) {
    //we reverse the sequence
    sequence = getReverseComplementSequenceString(sequence);
  }

  if (circular) {
    //we'll pass in double the sequence and then trim excess orfs
    sequence += sequence;
  }
  const re = useAdditionalOrfStartCodons 
  ? /(?=((?:A[TU]G|G[TU]G|C[TU]G)(?:.{3})*?(?:[TU]AG|[TU]AA|[TU]GA)))/gi
  : /(?=((?:A[TU]G)(?:.{3})*?(?:[TU]AG|[TU]AA|[TU]GA)))/gi;
  // const str = 'tatgaatgaatgffffffatgfftaaftaafatgfatgfffffsdfatgffatgfffstaafftaafffffffffffffffatgtaaataa\n\natgffftaaf\n\natgffatgftaafftaa\n\natgatgftaafftaa\n\natgatgtaataa\n\ntttttttttttttaatgatgfffffffffftaa';
  let m;
  const orfRanges = [];
  //loop through orf hits!
  /* eslint-disable no-cond-assign*/ 
  while ((m = re.exec(sequence)) !== null) {
    //stuff to get the regex to work
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    //orf logic:
    const orfLength = m[1].length;
    if (orfLength >= minimumOrfSize) {
      //only keep orfs >= to the minimum size
      const start = m.index;
      let end = orfLength + start - 1;
      //normalize the end if it is greater than the original sequence length
      if (end >= originalSequenceLength) {
        end -= originalSequenceLength;
      }
      if (start < originalSequenceLength) {
        //only keep orfs that *begin* before the original sequence length (only the case when dealing with circular orfs)
        orfRanges.push({
          start: start,
          end: end,
          length: m[1].length,
          internalStartCodonIndices: [],
          frame: start % 3,
          forward: forward,
          isOrf: true,
          id: ObjectId().str
        });
      }
    }
  }
  // pair down the orfs to remove duplicates
  // and deal with revComp orfs
  const orfEnds = {};
  orfRanges.forEach(function(orf, index) {
    const indexOfAlreadyExistingOrf = orfEnds[orf.end];

    if (typeof indexOfAlreadyExistingOrf !== "undefined") {
      const internalStartCodonIndex = forward
        ? orf.start
        : originalSequenceLength - orf.start - 1; //use either the start or the end depending on the direction of the orf
      //we know because of how the regex works that larger orfs come first in the array
      orfRanges[indexOfAlreadyExistingOrf].internalStartCodonIndices.push(
        internalStartCodonIndex
      );
      //set a flag that we'll use to remove all these shorter, duplicated orfs
      orf.remove = true;
    } else {
      orfEnds[orf.end] = index;
      if (!forward) {
        // if (originalSequenceLength - orf.end - 1 == 3657) {
        // }
        //this check needs to come after the above assignment of orfEnds
        //flip the start and ends
        const endHolder = orf.end; //temp variable
        orf.end = originalSequenceLength - orf.start - 1;
        orf.start = originalSequenceLength - endHolder - 1;
      }
    }
  });
  const nonDuplicatedOrfRanges = orfRanges.filter(function(orf) {
    if (!orf.remove) {
      return true;
    }
    return false
  });
  return nonDuplicatedOrfRanges;
};

//   const potentiallyDuplicatedOrfs = calculateOrfs(frame, sequence, minimumOrfSize, forward);

//   if (!forward) {
//     //we'll reverse the orfs start and end before (potentially) trimming them
//     potentiallyDuplicatedOrfs.forEach(function(orf) {
//       const endHolder = orf.end;
//       orf.end = orf.start;
//       orf.start = endHolder;
//     });
//   }
//   const nonDuplicatedOrfs;
//   if (circular) {
//     // we'll trim the excess orfs
//     nonDuplicatedOrfs = [];
//     potentiallyDuplicatedOrfs.forEach(function(orf) {
//       if (orf.start >= originalSequenceLength) {
//         //eliminate this orf because there must already be a normal orf with the same start bp (just shifted by 1 sequence length)
//       } else {
//         if (orf.end >= originalSequenceLength) {
//           orf.end -= originalSequenceLength;
//         }
//         nonDuplicatedOrfs.push(orf);
//       }
//     });
//   } else {
//     //non circular so
//     nonDuplicatedOrfs = potentiallyDuplicatedOrfs;
//   }
//   return nonDuplicatedOrfs;

//   function calculateOrfs(frame, sequence, minimumOrfSize, forward) {
//     const allOrfs = [];
//     const sequenceLength = sequence.length;

//     // const index = frame;
//     const triplet;
//     // const aaSymbol;
//     // const aaString = '';
//     // const startIndex = -1;
//     // const endIndex = -1;
//     const startCodonIndices = [];
//     const stopCodonIndices = [];
//     const possibleStopCodon;
//     const possibleStartCodon;
//     // Loop through sequence and generate list of ORFs.
//     for (const index = frame; index < sequenceLength; index += 3) {
//       triplet = sequence.slice(index, index + 3);
//       if (triplet.length === 3) {
//         // aaSymbol = getAminoAcidFromSequenceTriplet(triplet);
//         // aaString += aaSymbol.value;
//         possibleStartCodon = isStartCodon(triplet);
//         possibleStopCodon = isStopCodon(triplet);

//         // If we've found a start codon, add its index to startCodonIndices.
//         if (possibleStartCodon) {
//           startCodonIndices.push(index);
//         }
//         if (possibleStopCodon) {
//           stopCodonIndices.push(index);
//         }
//       }
//     }

//     //loop through the start codons and see if any of them form orfs
//     startCodonIndices.forEach(function(startCodonIndex) {
//       stopCodonIndices.some(function(stopCodonIndex) {
//         if (stopCodonIndex - startCodonIndex > 0) {
//           const orf = {
//             start: startCodonIndex,
//             end: stopCodonIndex,
//             forward: forward,
//             frame: frame,
//             startCodonIndices: startCodonIndices,
//             id: ObjectID().str
//           };
//           allOrfs.push(orf);
//           return true; //break the some loop
//         }
//       });
//     });
//     //after this we'll need to do a 'reduce' step to shave off the orfs that don't meet the minimum size requirements
//     //as well as the orfs with the same stop bp
//     //tnrtodo: inspect this function and make sure it is reducing the orfs correctly!
//     const trimmedOrfs = [];
//     allOrfs.forEach(function(orf) {
//       if (orf.end - orf.start + 1 >= minimumOrfSize) { //make sure the orf size is >= to the minimum size
//         const indexOfOrfWithSameStopBp = findIndex(trimmedOrfs, function(trimmedOrf) { //find any orfs with the same stop bp in the trimmed orf array
//           return trimmedOrf.end === orf.end;
//         });
//         if (indexOfOrfWithSameStopBp === -1) {
//           trimmedOrfs.push(orf);
//         } else {
//           if (trimmedOrfs[indexOfOrfWithSameStopBp].start > orf.start) {
//             trimmedOrfs[indexOfOrfWithSameStopBp] = orf; //replace the old orf at that position with this new orf because it is longer
//           }
//         }
//       }
//     });
//     return trimmedOrfs;
//   }
// };

// function isStartCodon(codon) {
//   return (codon == 'atg' || codon == 'aug' && codon.indexOf("-") === -1);
// }
// /**
//  * {Calculates whether a three character string is a stop codon.
//  * @param  {String} codon a three character string.
//  * @return {Boolean} shows whether the nucleotides make up a stop codon
//  */
// function isStopCodon(codon) {
//   return (codon == 'taa' || codon == 'tag' || codon == 'tga' || codon == 'uaa' || codon == 'uag' || codon == 'uga');
// }

/**
 * @private
 * Sorting function for sorting codons.
 * @param a
 * @param b
 * @return {Int} Sort order.
 */
// function codonsSort(a, b) {
//   if (a > b) {
//     return 1;
//   } else if (a < b) {
//     return -1;
//   } else {
//     return 0;
//   }
// }
