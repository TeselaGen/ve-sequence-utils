import getAminoAcidStringFromSequenceString from "./getAminoAcidStringFromSequenceString.js";
export default function getComplementAminoAcidStringFromSequenceString(sequenceString) {
  var aaString = getAminoAcidStringFromSequenceString(sequenceString, true);
  return aaString.split("").reverse().join("");
}
;