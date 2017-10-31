"use strict";

var getAminoAcidDataForEachBaseOfDna = require("./getAminoAcidDataForEachBaseOfDna");

module.exports = function getAminoAcidStringFromSequenceString(sequenceString) {
  var aminoAcidsPerBase = getAminoAcidDataForEachBaseOfDna(sequenceString, true);
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
};