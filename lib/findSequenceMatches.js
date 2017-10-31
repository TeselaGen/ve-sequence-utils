"use strict";

var _require = require("ve-range-utils"),
    modulateRangeBySequenceLength = _require.modulateRangeBySequenceLength;

var _require2 = require("lodash"),
    reduce = _require2.reduce;

var escapeStringRegexp = require("escape-string-regexp");
var getAminoAcidStringFromSequenceString = require("./getAminoAcidStringFromSequenceString");

var _require3 = require("./bioData"),
    ambiguous_dna_values = _require3.ambiguous_dna_values,
    extended_protein_values = _require3.extended_protein_values;

module.exports = function findSequenceMatches(sequence, searchString, options) {
  var _ref = options || {},
      isCircular = _ref.isCircular,
      isAmbiguous = _ref.isAmbiguous,
      isProteinSearch = _ref.isProteinSearch,
      searchReverseStrand = _ref.searchReverseStrand;

  var searchStringToUse = escapeStringRegexp(searchString);
  if (isAmbiguous) {
    if (isProteinSearch) {
      searchStringToUse = convertAmbiguousStringToRegex(searchStringToUse, true);
    } else {
      //we're searching DNA
      searchStringToUse = convertAmbiguousStringToRegex(searchStringToUse);
    }
  }
  var sequenceToUse = sequence;
  if (isCircular) {
    sequenceToUse = sequenceToUse + sequenceToUse;
  }
  var sequencesToCheck = [{ seqToCheck: sequenceToUse, offset: 0 }];
  if (isProteinSearch) {
    sequencesToCheck = [{
      seqToCheck: getAminoAcidStringFromSequenceString(sequenceToUse),
      offset: 0
    }, {
      seqToCheck: getAminoAcidStringFromSequenceString(sequenceToUse.substr(1)),
      offset: 1
    }, {
      seqToCheck: getAminoAcidStringFromSequenceString(sequenceToUse.substr(2)),
      offset: 2
    }];
  }

  var ranges = [];
  sequencesToCheck.forEach(function (_ref2) {
    var seqToCheck = _ref2.seqToCheck,
        offset = _ref2.offset;

    var reg = new RegExp(searchStringToUse, "ig");
    var match = void 0;
    var range = void 0;
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

function convertAmbiguousStringToRegex(string, isProtein) {
  // Search for a DNA subseq in sequence.
  // use ambiguous values (like N = A or T or C or G, R = A or G etc.)
  // searches only on forward strand
  return reduce(string, function (acc, nt) {
    var value = isProtein ? extended_protein_values[nt.toUpperCase()] : ambiguous_dna_values[nt.toUpperCase()];
    if (value.length === 1) {
      acc += value;
    } else {
      acc += "[" + value + "]";
    }
    return acc;
  }, "");
}