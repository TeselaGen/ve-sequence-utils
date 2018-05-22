const {getRangeLength} = require("ve-range-utils");
const insertSequenceDataAtPositionOrRange = require("./insertSequenceDataAtPositionOrRange");
const tidyUpSequenceData = require("./tidyUpSequenceData");

module.exports = function deleteSequenceDataAtRange(sequenceData, range) {
  if (getRangeLength(range, sequenceData.sequence.length) === sequenceData.sequence.length) {
    //handle the case where we're deleting everything!
    return tidyUpSequenceData({})
  }
  return insertSequenceDataAtPositionOrRange({}, sequenceData, range);
};
