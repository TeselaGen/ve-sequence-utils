// this is throwing a weird eslint error
// var ac = require('ve-api-check');
export default function filterSequenceString(sequenceString, additionalValidChars = "", charOverrides) {
  // ac.throw(ac.string,sequenceString);
  if (sequenceString) {
    return sequenceString.replace(new RegExp(`[^${charOverrides || `atgcyrswkmbvdhn${additionalValidChars.split("").join("\\")}`}]`, "gi"), "");
  } else {
    return sequenceString;
  }
}
;