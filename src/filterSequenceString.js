// this is throwing a weird eslint error

// var ac = require('ve-api-check');
module.exports = function filterSequenceString(sequenceString, additionalValidChars="") {
  // ac.throw(ac.string,sequenceString);
  if (sequenceString) {
    return sequenceString.replace(new RegExp(`[^atgcyrswkmbvdhn${additionalValidChars}]`, "gi"), "");
  } else {
    return sequenceString;
  }
};
