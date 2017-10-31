const { flatMap, extend } = require("lodash");
const {
  getSequenceWithinRange,
  getZeroedRangeOverlaps
} = require("ve-range-utils");
const tidyUpSequenceData = require("./tidyUpSequenceData");
const annotationTypes = require("./annotationTypes");

module.exports = function getSequenceDataBetweenRange(seqData, range) {
  const seqDataToUse = tidyUpSequenceData(seqData);
  let seqDataToReturn = extend(
    {},
    seqDataToUse,
    {
      sequence: getSequenceWithinRange(range, seqDataToUse.sequence)
    },
    annotationTypes.reduce((acc, type) => {
      acc[type] = getAnnotationsBetweenRange(
        seqDataToUse[type],
        range,
        seqDataToUse.sequence.length
      );
      return acc;
    }, {})
  );
  return tidyUpSequenceData(seqDataToReturn);
};

function getAnnotationsBetweenRange(annotationsToBeAdjusted, range, maxLength) {
  return flatMap(annotationsToBeAdjusted, function(annotation) {
    return getZeroedRangeOverlaps(annotation, range, maxLength).map(overlap => {
      return extend({}, annotation, overlap);
    });
  }); //filter any fully deleted ranges
}
