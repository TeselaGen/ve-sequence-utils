const { map, cloneDeep } = require("lodash");
const {
  adjustRangeToInsert,
  adjustRangeToDeletionOfAnotherRange
} = require("ve-range-utils");
const tidyUpSequenceData = require("./tidyUpSequenceData");
const modifiableTypes = require("./annotationTypes").modifiableTypes;
const adjustBpsToReplaceOrInsert = require("./adjustBpsToReplaceOrInsert");

module.exports = function insertSequenceDataAtPositionOrRange(
  _sequenceDataToInsert,
  _existingSequenceData,
  caretPositionOrRange
) {
  const existingSequenceData = tidyUpSequenceData(_existingSequenceData);
  const sequenceDataToInsert = tidyUpSequenceData(_sequenceDataToInsert);
  let newSequenceData = cloneDeep(existingSequenceData);
  const insertLength = sequenceDataToInsert.sequence.length;
  let caretPosition = caretPositionOrRange;

  //update the sequence
  newSequenceData.sequence = adjustBpsToReplaceOrInsert(
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
    newSequenceData[annotationType] = [];
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
    return {
      ...adjustRangeToInsert(annotation, insertStart, insertLength),
      ...(annotation.locations && {
        locations: annotation.locations.map(loc =>
          adjustRangeToInsert(loc, insertStart, insertLength)
        )
      })
    };
  });
}
function adjustAnnotationsToDelete(annotationsToBeAdjusted, range, maxLength) {
  return map(annotationsToBeAdjusted, function(annotation) {
    const newRange = adjustRangeToDeletionOfAnotherRange(
      annotation,
      range,
      maxLength
    );
    const newLocations =
      annotation.locations &&
      annotation.locations
        .map(loc => adjustRangeToDeletionOfAnotherRange(loc, range, maxLength))
        .filter(range => !!range);
    if (newLocations && newLocations.length) {
      return {
        ...newRange,
        start: newLocations[0].start,
        end: newLocations[newLocations.length - 1].end,
        ...(newLocations.length > 1 && { locations: newLocations })
      };
    } else {
      return newRange;
    }
  }).filter(range => !!range); //filter any fully deleted ranges
}
