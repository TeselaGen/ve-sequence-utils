import { getRangeLength } from 've-range-utils';
import insertSequenceDataAtPositionOrRange from "./insertSequenceDataAtPositionOrRange.js";
import tidyUpSequenceData from "./tidyUpSequenceData.js";
export default function deleteSequenceDataAtRange(sequenceData, range) {
  if (getRangeLength(range, sequenceData.sequence.length) === sequenceData.sequence.length) {
    //handle the case where we're deleting everything!
    return tidyUpSequenceData({});
  }

  return insertSequenceDataAtPositionOrRange({}, sequenceData, range);
}
;