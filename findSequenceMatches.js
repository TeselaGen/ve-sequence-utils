const { modulateRangeBySequenceLength } = require("ve-range-utils");
const getAminoAcidStringFromSequenceString = require("./getAminoAcidStringFromSequenceString");

module.exports = function findSequenceMatches(
  sequence,
  searchString,
  { isCircular, ambiguous, isProteinSearch } = {}
) {
  let sequenceToUse = sequence;
  if (isCircular) {
    sequenceToUse = sequenceToUse + sequenceToUse;
  }
  let sequencesToCheck = [{ seqToCheck: sequenceToUse, offset: 0 }];
  if (isProteinSearch) {
    sequencesToCheck = [
      {
        seqToCheck: getAminoAcidStringFromSequenceString(sequenceToUse),
        offset: 0
      },
      {
        seqToCheck: getAminoAcidStringFromSequenceString(
          sequenceToUse.substr(1)
        ),
        offset: 1
      },
      {
        seqToCheck: getAminoAcidStringFromSequenceString(
          sequenceToUse.substr(2)
        ),
        offset: 2
      }
    ];
  }

  let ranges = [];
  sequencesToCheck.forEach(({ seqToCheck, offset }) => {
    const reg = new RegExp(searchString, "ig");
    let match;
    let range;
    /* eslint-disable no-cond-assign*/

    while ((match = reg.exec(seqToCheck)) !== null) {
      range = {
        start: match.index,
        end: match.index + searchString.length - 1
      };
      if (isProteinSearch) {
        range.start = range.start * 3 + offset;
        range.end = range.end * 3 + 2 + offset;
      }
      ranges.push(modulateRangeBySequenceLength(range, sequence.length));
      reg.lastIndex = match.index + 1;
    }
    /* eslint-enable no-cond-assign*/
  });

  return ranges;
};
