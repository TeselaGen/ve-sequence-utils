const { uniqBy } = require("lodash");

//UNDER CONSTRUCTION

const {
  // getSequenceWithinRange,
  normalizePositionByRangeLength,
  getRangeLength
} = require("ve-range-utils");

module.exports = function getVirtualDigest({
  cutsites,
  sequenceLength,
  isCircular,
  allowPartialDigests
}) {
  let fragments = [];
  const overlappingEnzymes = [];
  let pairs = [];
  const sortedCutsites = cutsites.sort((a, b) => {
    return a.topSnipPosition - b.topSnipPosition;
  });

  sortedCutsites.forEach((cutsite1, index) => {
    if (allowPartialDigests) {
      sortedCutsites.forEach((cutsite2, index2) => {
        pairs.push([cutsite1, cutsite2]);
      });
    } else {
      pairs.push([
        cutsite1,
        sortedCutsites[index + 1]
          ? sortedCutsites[index + 1]
          : sortedCutsites[0]
      ]);
    }
  });
  // pairs = uniqBy(pairs, ([cut1,cut2]) => {
  //   return cut1.topSnipPosition > cut2.topSnipPosition ? (cut1.name || "cut1") + "_" + (cut2.name || "cut2") :  (cut2.name || "cut2") + "_" + (cut1.name || "cut1")
  // })

  pairs.forEach(([cut1, cut2]) => {
    const start = normalizePositionByRangeLength(
      cut1.topSnipPosition,
      sequenceLength
    );
    const end = normalizePositionByRangeLength(
      cut2.topSnipPosition - 1,
      sequenceLength
    );
    if (!isCircular && start > end) {
      //we have a fragment that spans the origin so we need to split it in 2 pieces
      const frag1 = {
        start: start,
        end: sequenceLength - 1,
        cut1,
        cut2: "endOfSeq"
      };
      const frag2 = {
        start: 0,
        end: end,
        cut1: "startOfSeq",
        cut2: cut2
      };

      fragments.push(addSizeAndId(frag1, sequenceLength));
      fragments.push(addSizeAndId(frag2, sequenceLength));
    } else {
      const frag = {
        cut1,
        cut2,
        start,
        end
      };
      fragments.push(addSizeAndId(frag, sequenceLength));
    }
  });
  // const sizeMap = {};
  fragments = fragments.filter(fragment => {
    if (!fragment.size) {
      overlappingEnzymes.push(fragment);
      return false;
    }
    // console.log('sizeMap:',sizeMap)
    // if (sizeMap[fragment.size]) {
    //   sizeMap[fragment.size].push(fragment);
    //   return false;
    // } else {
    //   sizeMap[fragment.size] = [fragment];
    // }
    return true;
  });
  return {
    fragments,
    overlappingEnzymes
  };
};

function addSizeAndId(frag, sequenceLength) {
  const size = getRangeLength(
    { start: frag.start, end: frag.end },
    sequenceLength
  );
  return {
    ...frag,
    size,
    id: frag.start + "-" + frag.end + "-" + size + "-"
  };
}
