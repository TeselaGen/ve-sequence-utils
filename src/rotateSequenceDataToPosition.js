const { map, cloneDeep } = require("lodash");
const {
  adjustRangeToInsert,
  adjustRangeToDeletionOfAnotherRange
} = require("ve-range-utils");
const tidyUpSequenceData = require("./tidyUpSequenceData");
const modifiableTypes = require("./annotationTypes").modifiableTypes;
const rotateBpsToPosition = require("./rotateBpsToPosition");

module.exports = function rotateSequenceDataToPosition(
  sequenceData,
  caretPosition,
) {
  const existingSequenceData = tidyUpSequenceData(sequenceData);
  let newSequenceData = cloneDeep(existingSequenceData)
  

  //update the sequence
  newSequenceData.sequence = rotateBpsToPosition(
    existingSequenceData.sequence,
    sequenceDataToInsert.sequence,
    caretPositionOrRange
  );

  //handle the insert
  modifiableTypes.forEach(annotationType => {
    let existingAnnotations = existingSequenceData[annotationType];
    //update the annotations:
    //handle the delete if necessary
    if (caretPositionOrRange && caretPositionOrRange.start > -1) {
      //we have a range! so let's delete it!
      const range = caretPositionOrRange;
      caretPosition = range.start;
      //update all annotations for the deletion
      existingAnnotations = adjustAnnotationsToDelete(
        existingAnnotations,
        range,
        existingSequenceData.sequence.length
      );
    }
    //first clear the newSequenceData's annotations
    newSequenceData[annotationType] = []
    //in two steps adjust the annotations to the insert
    newSequenceData[annotationType] = newSequenceData[annotationType].concat(
      adjustAnnotationsToInsert(
        existingAnnotations,
        caretPosition,
        insertLength
      )
    );
    newSequenceData[annotationType] = newSequenceData[annotationType].concat(
      adjustAnnotationsToInsert(
        sequenceDataToInsert[annotationType],
        0,
        caretPosition
      )
    );
  });
  return newSequenceData;
};

function adjustAnnotationsToInsert(
  annotationsToBeAdjusted,
  insertStart,
  insertLength
) {
  return map(annotationsToBeAdjusted, function(annotation) {
    return adjustRangeToInsert(annotation, insertStart, insertLength);
  });
}
function adjustAnnotationsToDelete(annotationsToBeAdjusted, range, maxLength) {
  return map(annotationsToBeAdjusted, function(annotation) {
    return adjustRangeToDeletionOfAnotherRange(annotation, range, maxLength);
  }).filter(range => !!range); //filter any fully deleted ranges
}
