import getAminoAcidDataForEachBaseOfDna from "./getAminoAcidDataForEachBaseOfDna.js";
export default function getReverseAminoAcidStringFromSequenceString(sequenceString) {
  var aminoAcidsPerBase = getAminoAcidDataForEachBaseOfDna(sequenceString, false);
  var aaArray = [];
  var aaString = "";
  aminoAcidsPerBase.forEach(function (aa) {
    if (!aa.fullCodon) {
      return;
    }

    aaArray[aa.aminoAcidIndex] = aa.aminoAcid.value;
  });
  aaString = aaArray.join("");
  return aaString;
}
;