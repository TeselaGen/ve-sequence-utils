// bam.seq: NTGTAAGTCGTGAAAAAANCNNNCATATTNCGGAGGTAAAAATGAAAA...
// bam.pos: 43
// bam.cigar: 36M2D917M3I17M7I2M1I6M5I4M1D6M12I8M
// (note: bam.cigar is null if the sequencing read is unaligned)

// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps into sequencing reads before starting bp pos and from own deletions & all seq reads' insertions, minus own insertions
module.exports = function addGapsToSeqReads(seqReads) {
  // 1) other seq reads' insertions
  // get all insertions in seq reads
  let allInsertions = [];
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
          const previousComponentNumber = Number(splitSeqRead[i].slice(0, -1));
          bpPosOfInsertion += previousComponentNumber;
        }
        let insertionInfo = {
          // keeping bpPos 1-based
          bpPos: bpPosOfInsertion,
          number: numberOfInsertions
        };
        allInsertions.push(insertionInfo);
      }
    }
  });
  // console.log('all insertions', allInsertions)

  let seqReadsWithGaps = [];
  const seqRead = seqReads[0];
  console.log("seq read", seqRead);
  // seqReads.forEach(seqRead => {
  // allInsertionsInSeqReads = [{"bpPos": 5, "number": 2}, {"bpPos": 7, "number": 1}, {"bpPos": 8, "number": 2}, {"bpPos": 9, "number": 3}];
  // reset allInsertionsInSeqReads for each seqRead
  let allInsertionsInSeqReads = allInsertions;
  // split cigar string at M, D, or I (match, deletion, or insertion), e.g. ["2M", "3I", "39M", "3D"...]
  const splitSeqReadChunk = seqRead.cigar.match(/([0-9]*[MDI])/g);
  // get own insertions
  for (
    let componentI = 0;
    componentI < splitSeqReadChunk.length;
    componentI++
  ) {
    if (splitSeqReadChunk[componentI].slice(-1) === "I") {
      let bpPosOfInsertion = seqRead.pos;
      const numberOfInsertions = Number(
        splitSeqReadChunk[componentI].slice(0, -1)
      );
      for (let i = 0; i < componentI; i++) {
        const previousComponentNumber = Number(
          splitSeqReadChunk[i].slice(0, -1)
        );
        bpPosOfInsertion += previousComponentNumber;
      }
      let insertionInfo = {
        // keeping bpPos 1-based
        bpPos: bpPosOfInsertion,
        number: numberOfInsertions
      };
      console.log("= allInsertions", allInsertionsInSeqReads);
      console.log("own insertion", insertionInfo);
      // remove own insertions from array of all insertions
      // let insertionInfoIndex = allInsertionsInSeqReads.indexOf(insertionInfo);
      let insertionInfoIndex = allInsertionsInSeqReads.findIndex(
        e =>
          e.bpPos === insertionInfo.bpPos && e.number === insertionInfo.number
      );
      console.log("insertionInfoIndex", insertionInfoIndex);
      allInsertionsInSeqReads.splice(insertionInfoIndex, 1);
    }
  }
  console.log("other seq reads insertions", allInsertionsInSeqReads);

  // 2) other seq reads' insertions + own deletions
  // get own deletions
  for (
    let componentI = 0;
    componentI < splitSeqReadChunk.length;
    componentI++
  ) {
    if (splitSeqReadChunk[componentI].slice(-1) === "D") {
      let bpPosOfDeletion = seqRead.pos;
      const numberOfDeletions = Number(
        splitSeqReadChunk[componentI].slice(0, -1)
      );
      for (let i = 0; i < componentI; i++) {
        const previousComponentNumber = Number(
          splitSeqReadChunk[i].slice(0, -1)
        );
        bpPosOfDeletion += previousComponentNumber;
      }
      let deletionInfo = {
        // keeping bpPos 1-based
        bpPos: bpPosOfDeletion,
        number: numberOfDeletions
      };
      console.log("own deletion", deletionInfo);
      // allInsertionsInSeqReads now contains own deletions & other seq reads' insertions as [{bpPos: bp pos of insertion, number: # of insertions}, {bpPos, number}, ...]
      allInsertionsInSeqReads.push(deletionInfo);
    }
  }
  console.log(
    "other seq reads insertions + own deletions",
    allInsertionsInSeqReads
  );
  // sort insertions & deletions by ascending bp pos
  let sortedGaps = allInsertionsInSeqReads.sort(function(a, b) {
    return a.bpPos - b.bpPos;
  });
  console.log("sorted ascending bpPos", sortedGaps);
  // combine duplicates or overlap
  // 'i < sortedGaps.length - 1' because when at the end of the array, there is no 'i + 1' to compare to
  for (let i = 0; i < sortedGaps.length - 1; i++) {
    while (sortedGaps[i].bpPos === sortedGaps[i + 1].bpPos) {
      if (sortedGaps[i].number > sortedGaps[i + 1].number) {
        // remove the one with fewer number of gaps from array
        sortedGaps.splice(i + 1, 1);
      } else if (sortedGaps[i].number < sortedGaps[i + 1].number) {
        sortedGaps.splice(i, 1);
      } else if (sortedGaps[i].number === sortedGaps[i + 1].number) {
        sortedGaps.splice(i, 1);
      }
    }
  }
  // sortedGaps contains own deletions & other seq reads' insertions (in ascending bpPos & w/o duplicates/overlap) as [{bpPos, number}, ...]
  console.log("combine duplicates or overlap", sortedGaps);

  // 3) add gaps before starting bp pos
  // turn seq read into an array ["A", "T", "C", "G"...]
  let seqReadWithGapsAtStartingBpPos = seqRead.seq.split("");
  // add gaps before the sequencing read based on starting bp pos of alignment
  for (let i = 1; i < seqRead.pos; i++) {
    seqReadWithGapsAtStartingBpPos.unshift("-");
  }
  console.log(
    "add gaps before starting bp pos",
    seqReadWithGapsAtStartingBpPos
  );

  // 4) add gaps (from own deletions & other seq reads' insertions)
  for (
    let i = 0;
    i < sortedGaps.length &&
    sortedGaps[i].bpPos <= seqReadWithGapsAtStartingBpPos.length;
    i++
  ) {
    const bpPosOfInsertion = sortedGaps[i].bpPos;
    const numberOfInsertions = sortedGaps[i].number;
    // adding gaps at the bp pos
    let insertionGaps = "";
    for (let gapI = 0; gapI < numberOfInsertions; gapI++) {
      insertionGaps += "-";
    }
    seqReadWithGapsAtStartingBpPos.splice(
      bpPosOfInsertion - 1,
      0,
      insertionGaps
    );
    for (let posI = i + 1; posI < sortedGaps.length; posI++) {
      sortedGaps[posI].bpPos += 1;
    }
    console.log("changing gaps array", sortedGaps);
    console.log("seq read", seqReadWithGapsAtStartingBpPos);
  }
  // !!!
  console.log("add all gaps", seqReadWithGapsAtStartingBpPos);
  // seqReadWithGapsAtStartingBpPos is a string "GGGA--GA-C--ACC"
  seqReadsWithGaps.push(seqReadWithGapsAtStartingBpPos.join(""));
  // seqReadsWithGaps.push(seqReadWithGapsAtStartingBpPos);
  // seqReadsWithGaps.push("--" + seqRead.seq);
  // seqReadsWithGaps.push(sortedInsertions);
  // });
  console.log("joined", seqReadsWithGaps);
  return seqReadsWithGaps;
  // 5) add gaps after seq read for ref seq's length = seq read's length
};

// // add gaps after the sequencing read for template's length = sequencing read's length
// for (let i = seqReadWithGapsAtDelPos.length; i < refSeq.length; i++) {
//   seqReadWithGapsAtDelPos.push("-");
// }

//   // 2) subtract own insertions
// //    e.g. if {bpPos: 6, number: 5} as other insertion & {bpPos: 6, number: 2} as own insertion, keep {bpPos: 6, number: 3} in the array (i.e. subtract the number of gaps)
// // any current duplicates/overlap must be due to own insertions
// // sort insertions by ascending bp pos
// let sortedInsertions = allInsertionsInSeqReads.sort(function(a, b) { return a.bpPos - b.bpPos });
// // subtract own insertions, e.g. if {bpPos: 6, number: 5} as other insertion & {bpPos: 6, number: 2} as own insertion, keep {bpPos: 6, number: 3} in the array (i.e. subtract the number of gaps)
// // 'i < sortedInsertions.length - 1' because when at the end of the array, there is no 'i + 1' to compare to
// for (let i = 0; i < sortedInsertions.length - 1; i++) {
//   if (sortedInsertions[i].bpPos === sortedInsertions[i + 1].bpPos) {
//     if (sortedInsertions[i].number > sortedInsertions[i + 1].number) {
//       let bpPos = sortedInsertions[i].bpPos;
//       let iNumber = sortedInsertions[i].number;
//       let iPlusOneNumber = sortedInsertions[i + 1].number;
//       sortedInsertions.splice(sortedInsertions[i + 1], 1);
//       sortedInsertions.splice(sortedInsertions[i], 1);
//       sortedInsertions.splice(sortedInsertions[i], 0, {bpPos: bpPos, number: iNumber - iPlusOneNumber});
//       i = i - 2;
//     } else if (sortedInsertions[i].number < sortedInsertions[i + 1].number) {
//       let bpPos = sortedInsertions[i].bpPos;
//       let iNumber = sortedInsertions[i].number;
//       let iPlusOneNumber = sortedInsertions[i + 1].number;
//       sortedInsertions.splice(sortedInsertions[i + 1], 1);
//       sortedInsertions.splice(sortedInsertions[i], 1);
//       sortedInsertions.splice(sortedInsertions[i], 0, {bpPos: bpPos, number: iPlusOneNumber - iNumber});
//       i = i - 2;
//     } else if (sortedInsertions[i].number === sortedInsertions[i + 1].number) {
//       sortedInsertions.splice(sortedInsertions[i], 1);
//       i--;
//     }
//   }
// }
