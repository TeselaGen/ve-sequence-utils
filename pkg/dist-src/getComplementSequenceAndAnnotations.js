import getComplementSequenceString from "./getComplementSequenceString.js";
import tidyUpSequenceData from "./tidyUpSequenceData.js"; // const ac = require('ve-api-check');

import getSequenceDataBetweenRange from "./getSequenceDataBetweenRange.js"; // ac.throw([ac.string,ac.bool],arguments);

export default function getReverseComplementSequenceAndAnnoations(pSeqObj, options = {}) {
  const seqObj = tidyUpSequenceData(getSequenceDataBetweenRange(pSeqObj, options.range), options);
  const newSeqObj = Object.assign({}, seqObj, {
    sequence: getComplementSequenceString(seqObj.sequence)
  });
  return tidyUpSequenceData(newSeqObj, options);
}
;