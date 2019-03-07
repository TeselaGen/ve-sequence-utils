import getReverseComplementSequenceString from "./getReverseComplementSequenceString.js";
import getReverseComplementAnnotation from "./getReverseComplementAnnotation.js";
import annotationTypes from "./annotationTypes.js";
import { map } from 'lodash';
import tidyUpSequenceData from "./tidyUpSequenceData.js"; // const ac = require('ve-api-check');

import getSequenceDataBetweenRange from "./getSequenceDataBetweenRange.js"; // ac.throw([ac.string,ac.bool],arguments);

export default function getReverseComplementSequenceAndAnnoations(pSeqObj, options = {}) {
  const seqObj = tidyUpSequenceData(getSequenceDataBetweenRange(pSeqObj, options.range), options);
  const newSeqObj = Object.assign({}, seqObj, {
    sequence: getReverseComplementSequenceString(seqObj.sequence)
  }, annotationTypes.reduce(function (acc, type) {
    if (seqObj[type]) {
      acc[type] = map(seqObj[type], function (annotation) {
        return getReverseComplementAnnotation(annotation, seqObj.sequence.length);
      });
    }

    return acc;
  }, {}));
  return tidyUpSequenceData(newSeqObj, options);
}
;