import getAminoAcidStringFromSequenceString from "./getAminoAcidStringFromSequenceString.js";
import getReverseComplementSequenceString from "./getReverseComplementSequenceString.js";
export default function getReverseComplementAminoAcidStringFromSequenceString(sequenceString) {
  return getAminoAcidStringFromSequenceString(getReverseComplementSequenceString(sequenceString));
}
;