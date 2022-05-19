const DNAComplementMap = require("./DNAComplementMap");
// const ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
module.exports = function getReverseSequenceString(sequence) {
  // ac.throw([ac.string],arguments);
  let reverseSequenceString = "";
  for (let i = sequence.length - 1; i >= 0; i--) {
    let revChar = sequence[i];
    if (!revChar) {
      revChar = sequence[i];
      // throw new Error('trying to get the reverse of an invalid base');
    }
    reverseSequenceString += revChar;
  }
  return reverseSequenceString;
};
