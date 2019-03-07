import { cloneDeep } from 'lodash';
import { getYOffsetsForPotentiallyCircularRanges } from 've-range-utils';
import annotationTypes from "./annotationTypes.js"; //basically just adds yOffsets to the annotations

export default function prepareCircularViewData(sequenceData) {
  var clonedSeqData = cloneDeep(sequenceData);
  annotationTypes.forEach(function (annotationType) {
    if (annotationType !== "cutsites") {
      var maxYOffset = getYOffsetsForPotentiallyCircularRanges(clonedSeqData[annotationType]).maxYOffset;
      clonedSeqData[annotationType].maxYOffset = maxYOffset;
    }
  });
  return clonedSeqData;
}
;