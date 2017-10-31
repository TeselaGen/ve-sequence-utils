var _require = require("lodash"),
    flatMap = _require.flatMap,
    extend = _require.extend;

var _require2 = require("ve-range-utils"),
    getSequenceWithinRange = _require2.getSequenceWithinRange,
    getZeroedRangeOverlaps = _require2.getZeroedRangeOverlaps;

var tidyUpSequenceData = require("./tidyUpSequenceData");
var annotationTypes = require("./annotationTypes");

module.exports = function getSequenceDataBetweenRange(seqData, range) {
  var seqDataToUse = tidyUpSequenceData(seqData);
  var seqDataToReturn = extend({}, seqDataToUse, {
    sequence: getSequenceWithinRange(range, seqDataToUse.sequence)
  }, annotationTypes.reduce(function (acc, type) {
    acc[type] = getAnnotationsBetweenRange(seqDataToUse[type], range, seqDataToUse.sequence.length);
    return acc;
  }, {}));
  return tidyUpSequenceData(seqDataToReturn);
};

function getAnnotationsBetweenRange(annotationsToBeAdjusted, range, maxLength) {
  return flatMap(annotationsToBeAdjusted, function (annotation) {
    return getZeroedRangeOverlaps(annotation, range, maxLength).map(function (overlap) {
      return extend({}, annotation, overlap);
    });
  }); //filter any fully deleted ranges
}