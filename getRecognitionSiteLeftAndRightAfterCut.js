var isPositionWithinRange = require('ve-range-utils/isPositionWithinRange')
var getSequenceWithinRange = require('ve-range-utils/getSequenceWithinRange')
var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength')
var isPositionCloserToRangeStartThanRangeEnd = require('ve-range-utils/isPositionCloserToRangeStartThanRangeEnd')

module.exports = function getRecognitionSiteLeftAndRightAfterCut(cutsite, sequence, sequenceLength) {
  var result = {
    leftHandSide: '',
    rightHandSide: '',
  }
  if (isPositionWithinRange(cutsite.downstreamTopSnip, cutsite.recognitionSiteRange)) {
    result.leftHandSide = getSequenceWithinRange({start: cutsite.recognitionSiteRange.start, end: normalizePositionByRangeLength(cutsite.downstreamTopSnip-1, sequence.length)}, sequence)
    result.rightHandSide = getSequenceWithinRange({start:cutsite.downstreamTopSnip, end: cutsite.recognitionSiteRange.end}, sequence)
  } else {
    if (isPositionCloserToRangeStartThanRangeEnd(cutsite.downstreamTopSnip, cutsite.recognitionSiteRange, sequenceLength)) {
      result.rightHandSide = getSequenceWithinRange(cutsite.recognitionSiteRange, sequence)
    } else {
      result.leftHandSide = getSequenceWithinRange(cutsite.recognitionSiteRange, sequence)
    }
  }
  return result
}
