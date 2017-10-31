"use strict";

var _require = require("lodash"),
    map = _require.map;

var _require2 = require("ve-range-utils"),
    adjustRangeToInsert = _require2.adjustRangeToInsert,
    adjustRangeToDeletionOfAnotherRange = _require2.adjustRangeToDeletionOfAnotherRange;

var tidyUpSequenceData = require("./tidyUpSequenceData");
var modifiableTypes = require("./annotationTypes").modifiableTypes;
var adjustBpsToReplaceOrInsert = require("./adjustBpsToReplaceOrInsert");

module.exports = function insertSequenceDataAtPositionOrRange(_sequenceDataToInsert, _existingSequenceData, caretPositionOrRange) {
  var existingSequenceData = tidyUpSequenceData(_existingSequenceData);
  var sequenceDataToInsert = tidyUpSequenceData(_sequenceDataToInsert);
  var newSequenceData = tidyUpSequenceData({}); //makes a new blank sequence
  var insertLength = sequenceDataToInsert.sequence.length;
  var caretPosition = caretPositionOrRange;

  //update the sequence
  newSequenceData.sequence = adjustBpsToReplaceOrInsert(existingSequenceData.sequence, sequenceDataToInsert.sequence, caretPositionOrRange);

  //handle the insert
  modifiableTypes.forEach(function (annotationType) {
    var existingAnnotations = existingSequenceData[annotationType];
    //update the annotations:
    //handle the delete if necessary
    if (caretPositionOrRange && caretPositionOrRange.start > -1) {
      //we have a range! so let's delete it!
      var range = caretPositionOrRange;
      caretPosition = range.start;
      //update all annotations for the deletion
      existingAnnotations = adjustAnnotationsToDelete(existingAnnotations, range, existingSequenceData.sequence.length);
    }

    newSequenceData[annotationType] = newSequenceData[annotationType].concat(adjustAnnotationsToInsert(existingAnnotations, caretPosition, insertLength));
    newSequenceData[annotationType] = newSequenceData[annotationType].concat(adjustAnnotationsToInsert(sequenceDataToInsert[annotationType], 0, caretPosition));
  });
  return newSequenceData;
};

function adjustAnnotationsToInsert(annotationsToBeAdjusted, insertStart, insertLength) {
  return map(annotationsToBeAdjusted, function (annotation) {
    return adjustRangeToInsert(annotation, insertStart, insertLength);
  });
}
function adjustAnnotationsToDelete(annotationsToBeAdjusted, range, maxLength) {
  return map(annotationsToBeAdjusted, function (annotation) {
    return adjustRangeToDeletionOfAnotherRange(annotation, range, maxLength);
  }).filter(function (range) {
    return !!range;
  }); //filter any fully deleted ranges
}