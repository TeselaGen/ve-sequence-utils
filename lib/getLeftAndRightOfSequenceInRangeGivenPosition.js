"use strict";

var _require = require("ve-range-utils"),
    isPositionWithinRange = _require.isPositionWithinRange,
    getSequenceWithinRange = _require.getSequenceWithinRange,
    normalizePositionByRangeLength = _require.normalizePositionByRangeLength,
    isPositionCloserToRangeStartThanRangeEnd = _require.isPositionCloserToRangeStartThanRangeEnd;

module.exports = function getLeftAndRightOfSequenceInRangeGivenPosition(range, position, sequence) {
  var result = {
    leftHandSide: "",
    rightHandSide: ""
  };
  if (isPositionWithinRange(position, range)) {
    result.leftHandSide = getSequenceWithinRange({
      start: range.start,
      end: normalizePositionByRangeLength(position - 1, sequence.length)
    }, sequence);
    result.rightHandSide = getSequenceWithinRange({ start: position, end: range.end }, sequence);
  } else {
    if (isPositionCloserToRangeStartThanRangeEnd(position, range, sequence.length)) {
      result.rightHandSide = getSequenceWithinRange(range, sequence);
    } else {
      result.leftHandSide = getSequenceWithinRange(range, sequence);
    }
  }
  return result;
};