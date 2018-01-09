const getComplementSequenceString = require("./getComplementSequenceString");
const tidyUpSequenceData = require("./tidyUpSequenceData");
// const ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
module.exports = function getReverseComplementSequenceAndAnnoations(
  pSeqObj,
  options
) {
  const seqObj = tidyUpSequenceData(pSeqObj, options);
  const newSeqObj = Object.assign(
    {},
    seqObj,
    {
      sequence: getComplementSequenceString(seqObj.sequence)
    },
  );
  return tidyUpSequenceData(newSeqObj, options);
};
