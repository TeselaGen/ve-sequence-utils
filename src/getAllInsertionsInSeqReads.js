// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
module.exports = function getAllInsertionsInSeqReads(seqReads) {
  let allInsertionsInSeqReads = [];
  seqReads.forEach(seqRead => {
    // split cigar string at M, D, or I (match, deletion, or insertion), e.g. ["2M", "3I", "39M", "3D"...]
    const splitSeqRead = seqRead.cigar.match(/([0-9]*[MDI])/g);

    for (let componentI = 0; componentI < splitSeqRead.length; componentI++) {
      if (splitSeqRead[componentI].slice(-1) === "I") {
        let bpPosOfInsertion = seqRead.pos;
        const numberOfInsertions = Number(
          splitSeqRead[componentI].slice(0, -1)
        );
        for (let i = 0; i < componentI; i++) {
          if (splitSeqRead[i].slice(-1) !== "I") {
            const previousComponentNumber = Number(
              splitSeqRead[i].slice(0, -1)
            );
            bpPosOfInsertion += previousComponentNumber;
          }
        }
        let insertionInfo = {
          // keeping bpPos 1-based
          bpPos: bpPosOfInsertion,
          number: numberOfInsertions
        };
        allInsertionsInSeqReads.push(insertionInfo);
      }
    }
  });
  // console.log("all insertions", allInsertionsInSeqReads)
  // sort insertions by ascending bp pos
  let sortedInsertions = allInsertionsInSeqReads.sort(function(a, b) {
    return a.bpPos - b.bpPos;
  });
  // console.log("sorted insertions", sortedInsertions)
  // combine duplicate or overlapping insertions from seq reads
  for (let i = 0; i < sortedInsertions.length - 1; i++) {
    if (sortedInsertions[i].bpPos === sortedInsertions[i + 1].bpPos) {
      if (sortedInsertions[i].number > sortedInsertions[i + 1].number) {
        // remove the one with fewer number of gaps from array
        sortedInsertions.splice(i + 1, 1);
        i--;
      } else if (sortedInsertions[i].number < sortedInsertions[i + 1].number) {
        sortedInsertions.splice(i, 1);
        i--;
      } else if (
        sortedInsertions[i].number === sortedInsertions[i + 1].number
      ) {
        // console.log("i of sortedInsertions[i].number", i)
        // console.log("sortedInsertions[i]", sortedInsertions[i])
        // console.log("sortedInsertions[i].number", sortedInsertions[i].number)
        // console.log("sorted insertions before", sortedInsertions)
        sortedInsertions.splice(i, 1);
        // console.log("sorted insertions after", sortedInsertions)
        i--;
      }
    }
  }
  // sortedInsertions is an array of objects [{bpPos: bp pos of insertion, number: # of insertions}, {bpPos, number}, ...]
  // console.log("combine duplicates/overlaps", sortedInsertions)
  return sortedInsertions;
};

// function getAllInsertionsInSeqReads(seqReads) {
//   let allInsertionBpPosInSeqReads = [];
//   seqReads.forEach(seqRead => {
//     // split cigar string at M, D, or I (match, deletion, or insertion)
//     // ["2M", "3I", "39M", "3D"...]
//     const splitSeqRead = seqRead.cigar.match(/([0-9]*[MDI])/g)
//     splitSeqRead.forEach(component => {
//       // keeping bpPos 1-based
//       let bpPosOfInsertion = seqRead.pos;
// if (component.slice(-1) === "I") {
//   const numberOfInsertions = Number(component.slice(0, -1));
//   const componentIndex = splitSeqRead.indexOf(component);
//   for (let i = 0; i < componentIndex; i++) {
//       const previousComponentNumber = Number(splitSeqRead[i].slice(0, -1));
//       bpPosOfInsertion += previousComponentNumber;
//     }
//   for (let i = 1; i <= numberOfInsertions; i++) {
//     allInsertionBpPosInSeqReads.push(bpPosOfInsertion - i);
//   }
// }
//   });
// });
//   // allInsertionBpPosInSeqReads should be an array of bp pos [6, 15, 9, 2, 23...]
//   // remove duplicates, organize in ascending order
// const uniqueInsertionBpPos = [...new Set(allInsertionBpPosInSeqReads)].sort(function(a, b) { return a - b });
//   return uniqueInsertionBpPos;
// }
