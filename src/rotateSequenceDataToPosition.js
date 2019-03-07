import { map } from 'lodash';
import { adjustRangeToRotation } from 've-range-utils';
import tidyUpSequenceData from './tidyUpSequenceData';
import { modifiableTypes } from './annotationTypes';
import rotateBpsToPosition from './rotateBpsToPosition';

export default function rotateSequenceDataToPosition(
  sequenceData,
  caretPosition
) {
  const newSequenceData = tidyUpSequenceData(sequenceData);

  //update the sequence
  newSequenceData.sequence = rotateBpsToPosition(
    newSequenceData.sequence,
    caretPosition
  );

  //handle the insert
  modifiableTypes.forEach(annotationType => {
    //update the annotations:
    //handle the delete if necessary
    newSequenceData[annotationType] = adjustAnnotationsToRotation(
      newSequenceData[annotationType],
      caretPosition,
      newSequenceData.sequence.length
    );
  });
  return newSequenceData;
}

function adjustAnnotationsToRotation(
  annotationsToBeAdjusted,
  positionToRotateTo,
  maxLength
) {
  return map(annotationsToBeAdjusted, function(annotation) {
    return adjustRangeToRotation(annotation, positionToRotateTo, maxLength);
  }).filter(range => !!range); //filter any fully deleted ranges
}
