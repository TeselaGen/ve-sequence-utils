const bsonObjectId = require("bson-objectid");
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
          annotationTypePlural: "orfs",
          isOrf: true,
          id: bsonObjectId().str
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
      let internalOrf = orf;
      let containingOrf = orfRanges[indexOfAlreadyExistingOrf];
      if (containingOrf.length < internalOrf.length) {
        internalOrf = orfRanges[indexOfAlreadyExistingOrf];
        containingOrf = orf;
        orfEnds[orf.end] = index;
      }
      const internalStartCodonIndex = forward
        ? internalOrf.start
        : originalSequenceLength - internalOrf.start - 1; //use either the start or the end depending on the direction of the internalOrf
      //we know because of how the regex works that larger orfs come first in the array
      containingOrf.internalStartCodonIndices = [
        ...containingOrf.internalStartCodonIndices,
        ...internalOrf.internalStartCodonIndices,
        internalStartCodonIndex
      ];
      //set a flag that we'll use to remove all these shorter, duplicated orfs
      internalOrf.remove = true;
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
    return false;
  });
  return nonDuplicatedOrfRanges;
};
