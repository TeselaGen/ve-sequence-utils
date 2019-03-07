import getAminoAcidDataForEachBaseOfDna from './getAminoAcidDataForEachBaseOfDna';

export default function getReverseAminoAcidStringFromSequenceString(
  sequenceString
) {
  let aminoAcidsPerBase = getAminoAcidDataForEachBaseOfDna(
    sequenceString,
    false
  );
  let aaArray = [];
  let aaString = "";
  aminoAcidsPerBase.forEach(function(aa) {
    if (!aa.fullCodon) {
      return;
    }
    aaArray[aa.aminoAcidIndex] = aa.aminoAcid.value;
  });
  aaString = aaArray.join("");
  return aaString;
}
