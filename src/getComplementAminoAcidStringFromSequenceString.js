import getAminoAcidStringFromSequenceString from './getAminoAcidStringFromSequenceString';

export default function getComplementAminoAcidStringFromSequenceString(
  sequenceString
) {
  let aaString = getAminoAcidStringFromSequenceString(sequenceString, true);
  return aaString
    .split("")
    .reverse()
    .join("");
}
