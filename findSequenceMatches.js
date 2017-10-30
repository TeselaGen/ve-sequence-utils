const { modulateRangeBySequenceLength } = require("ve-range-utils");
const { reduce } = require("lodash");
const getAminoAcidStringFromSequenceString = require("./getAminoAcidStringFromSequenceString");
const { ambiguous_dna_values } = require("./bioData");

module.exports = function findSequenceMatches(sequence, searchString, options) {
  const { isCircular, isAmbiguous, isProteinSearch } = options || {};
  let searchStringToUse = searchString;
  if (isAmbiguous) {
    if (!isProteinSearch) {
      //we're searching DNA
      searchStringToUse = convertAmbiguousDnaToRegex(searchStringToUse);
    }
  }
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
    const reg = new RegExp(searchStringToUse, "ig");
    let match;
    let range;
    /* eslint-disable no-cond-assign*/

    while ((match = reg.exec(seqToCheck)) !== null) {
      range = {
        start: match.index,
        end: match.index + searchString.length - 1 //this should be the original searchString here j
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

function convertAmbiguousDnaToRegex(dnaString) {
  // Search for a DNA subseq in sequence.
  // use ambiguous values (like N = A or T or C or G, R = A or G etc.)
  // searches only on forward strand
  return reduce(
    dnaString,
    (acc, nt) => {
      const value = ambiguous_dna_values[nt.toUpperCase()];
      if (value.length === 1) {
        acc += value;
      } else {
        acc += `[${value}]`;
      }
      return acc;
    },
    ""
  );
}
// def nt_search(seq, subseq):
// """
// """
// pattern = ''
// for nt in subseq:
//     value = IUPACData.ambiguous_dna_values[nt]

// pos = -1
// result = [pattern]
// l = len(seq)
// while True:
//     pos += 1
//     s = seq[pos:]
//     m = re.search(pattern, s)
//     if not m:
//         break
//     pos += int(m.start(0))
//     result.append(pos)
// return result
