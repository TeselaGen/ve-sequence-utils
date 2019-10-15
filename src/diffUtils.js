const { cloneDeep, forEach } = require("lodash");
const differ = require("jsondiffpatch").create({
  // cloneDiffValues: true
});

const getDiffFromSeqs = (oldData, newData) => {
  [oldData, newData].forEach(d => {
    ["cutsites", "orfs", "filteredFeatures", "size"].forEach(prop => {
      delete d[prop];
    });
    if (d.translations) {
      forEach(d.translations, translation => {
        delete translation.aminoAcids;
      });
    }
  });

  // try {
  //   delete oldData.trn;
  //   delete newData.trn;
  // }

  return differ.diff(oldData, newData);
};
const patchSeqWithDiff = (oldData, diff) => {
  return differ.patch(cloneDeep(oldData), diff);
};
const reverseSeqDiff = diff => {
  return differ.reverse(diff);
};

module.exports = { getDiffFromSeqs, patchSeqWithDiff, reverseSeqDiff };
