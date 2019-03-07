import DNAComplementMap from './DNAComplementMap';

// const ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
export default function getReverseComplementSequenceString(sequence) {
  // ac.throw([ac.string],arguments);
  let reverseComplementSequenceString = "";
  for (let i = sequence.length - 1; i >= 0; i--) {
    let revChar = DNAComplementMap[sequence[i]];
    if (!revChar) {
      revChar = sequence[i];
      // throw new Error('trying to get the reverse compelement of an invalid base');
    }
    reverseComplementSequenceString += revChar;
  }
  return reverseComplementSequenceString;
}
