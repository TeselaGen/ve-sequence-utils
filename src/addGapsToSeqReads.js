// bam.seq: NTGTAAGTCGTGAAAAAANCNNNCATATTNCGGAGGTAAAAATGAAAA...
// bam.pos: 43
// bam.cigar: 36M2D917M3I17M7I2M1I6M5I4M1D6M12I8M
// (note: bam.cigar is null if the sequencing read is unaligned)

// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps into sequencing reads before starting bp pos and from own deletions & all seq reads' insertions, minus own insertions
module.exports = function addGapsToSeqReads(seqReads) {
  let seqReadsWithGaps = [];
  // const seqRead = seqReads[0];
  // console.log("seq read", seqRead);
  seqReads.forEach(seqRead => {
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
            const previousComponentNumber = Number(
              splitSeqRead[i].slice(0, -1)
            );
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
    console.log("all insertions", allInsertions);
    // allInsertionsInSeqReads = [{"bpPos": 5, "number": 2}, {"bpPos": 7, "number": 1}, {"bpPos": 8, "number": 2}, {"bpPos": 9, "number": 3}];
    let allInsertionsInSeqReads = allInsertions;
    console.log("allInsertionsInSeqReads", allInsertionsInSeqReads);

    // 1) add gaps before starting bp pos
    // turn seq read into an array ["A", "T", "C", "G"...]
    let seqReadWithGapsAtStart = seqRead.seq.split("");
    // add gaps before the sequencing read based on starting bp pos of alignment
    for (let i = 1; i < seqRead.pos; i++) {
      seqReadWithGapsAtStart.unshift("-");
    }
    console.log("add gaps before starting bp pos", seqReadWithGapsAtStart);

    // 2) add own deletions to own sequence
    // split cigar string at M, D, or I (match, deletion, or insertion), e.g. ["2M", "3I", "39M", "3D"...]
    const splitSeqReadChunk = seqRead.cigar.match(/([0-9]*[MDI])/g);
    // get own deletions
    let ownDeletions = [];
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
        ownDeletions.push(deletionInfo);
      }
    }
    console.log("own deletions", ownDeletions);
    // sort deletions by ascending bp pos
    let sortedOwnDeletions = ownDeletions.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    console.log("sorted ascending own deletions", sortedOwnDeletions);
    // add own deletions to own sequence
    for (let ownD = 0; ownD < sortedOwnDeletions.length; ownD++) {
      const bpPosOfDeletion = sortedOwnDeletions[ownD].bpPos;
      const numberOfDeletions = sortedOwnDeletions[ownD].number;
      // adding gaps at the bp pos
      let deletionGaps = "";
      for (let gapD = 0; gapD < numberOfDeletions; gapD++) {
        deletionGaps += "-";
      }
      seqReadWithGapsAtStart.splice(bpPosOfDeletion - 1, 0, deletionGaps);
      for (let posD = ownD + 1; posD < sortedOwnDeletions.length; posD++) {
        sortedOwnDeletions[posD].bpPos += 1;
      }
      console.log("sorted own deletions", sortedOwnDeletions);
      console.log("after adding own deletions", seqReadWithGapsAtStart);
    }
    seqReadWithGapsAtStart = seqReadWithGapsAtStart.join("").split("");
    console.log(
      "after adding own deletions & splitting",
      seqReadWithGapsAtStart
    );

    // 3) remove own insertions from own sequence
    // get own insertions
    let ownInsertions = [];
    let ownInsertionsBp = [];
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
        let nucleotides = [];
        for (let i = 0; i < componentI; i++) {
          const previousComponentNumber = Number(
            splitSeqReadChunk[i].slice(0, -1)
          );
          bpPosOfInsertion += previousComponentNumber;
        }
        for (let nucI = 0; nucI < numberOfInsertions; nucI++) {
          nucleotides.push(seqReadWithGapsAtStart[bpPosOfInsertion - 1 + nucI]);
        }
        let insertionInfo = {
          // keeping bpPos 1-based
          bpPos: bpPosOfInsertion,
          number: numberOfInsertions
        };
        let insertionInfoBp = {
          // keeping bpPos 1-based
          bpPos: bpPosOfInsertion,
          number: numberOfInsertions,
          nucleotides: nucleotides
        };
        ownInsertions.push(insertionInfo);
        ownInsertionsBp.push(insertionInfoBp);
      }
    }
    console.log("own insertions", ownInsertions);
    console.log("own insertions bp", ownInsertionsBp);
    // sort own insertions by ascending bp pos
    let sortedOwnInsertions = ownInsertions.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    let sortedOwnInsertionsBp = ownInsertionsBp.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    console.log("sorted ascending own insertions", sortedOwnInsertions);
    console.log("sorted ascending own insertions bp", sortedOwnInsertionsBp);
    // remove own insertions from own sequence
    for (let ownI = 0; ownI < sortedOwnInsertions.length; ownI++) {
      const bpPosOfInsertion = sortedOwnInsertions[ownI].bpPos;
      const numberOfInsertions = sortedOwnInsertions[ownI].number;
      for (let numI = 0; numI < numberOfInsertions; numI++) {
        seqReadWithGapsAtStart.splice(bpPosOfInsertion - 1, 1);
      }
      for (let posI = ownI + 1; posI < sortedOwnInsertions.length; posI++) {
        sortedOwnInsertions[posI].bpPos -= numberOfInsertions;
      }
      console.log("sorted own insertions", sortedOwnInsertions);
      console.log("after removing own insertions", seqReadWithGapsAtStart);
    }

    // 4) add other seq reads' insertions to seq read (if not found in own deletions...remove all that are same as own deletions)
    // get other seq reads' insertions (i.e. all insertions minus own insertions minus duplicates)
    let otherInsertions = allInsertionsInSeqReads;
    for (let otherI = 0; otherI < ownInsertions.length; otherI++) {
      let insertionInfoIndex = allInsertionsInSeqReads.findIndex(
        e =>
          e.bpPos === ownInsertions[otherI].bpPos &&
          e.number === ownInsertions[otherI].number
      );
      if (insertionInfoIndex !== -1) {
        otherInsertions.splice(insertionInfoIndex, 1);
        otherI--;
      }
      console.log("insertionInfoIndex", insertionInfoIndex);
      console.log(
        "other seq reads insertions, maybe duplicates",
        otherInsertions
      );
    }
    // sort other insertions by ascending bp pos
    let sortedOtherInsertions = otherInsertions.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    console.log("sorted ascending other insertions", sortedOtherInsertions);
    // combine duplicates or overlap
    // 'i < sortedOtherInsertions.length - 1' because when at the end of the array, there is no 'i + 1' to compare to
    for (let i = 0; i < sortedOtherInsertions.length - 1; i++) {
      while (
        sortedOtherInsertions[i].bpPos === sortedOtherInsertions[i + 1].bpPos
      ) {
        if (
          sortedOtherInsertions[i].number > sortedOtherInsertions[i + 1].number
        ) {
          // remove the one with fewer number of gaps from array
          sortedOtherInsertions.splice(i + 1, 1);
        } else if (
          sortedOtherInsertions[i].number < sortedOtherInsertions[i + 1].number
        ) {
          sortedOtherInsertions.splice(i, 1);
        } else if (
          sortedOtherInsertions[i].number ===
          sortedOtherInsertions[i + 1].number
        ) {
          sortedOtherInsertions.splice(i, 1);
        }
      }
    }
    console.log(
      "other seq reads insertions, w/o duplicates",
      sortedOtherInsertions
    );
    // add other seq reads' insertions to sequence (if not in own deletions)
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    for (
      let otherI = 0;
      otherI < sortedOtherInsertions.length &&
      sortedOtherInsertions[otherI].bpPos <= seqReadWithGapsAtStart.length;
      otherI++
    ) {
      let insertionIsPresent = sortedOwnDeletions.some(
        e =>
          e.bpPos === sortedOtherInsertions[otherI].bpPos &&
          e.number === sortedOtherInsertions[otherI].number
      );
      if (insertionIsPresent === false) {
        const bpPosOfInsertion = sortedOtherInsertions[otherI].bpPos;
        const numberOfInsertions = sortedOtherInsertions[otherI].number;
        // adding gaps at the bp pos
        let insertionGaps = "";
        for (let gapI = 0; gapI < numberOfInsertions; gapI++) {
          insertionGaps += "-";
        }
        seqReadWithGapsAtStart.splice(bpPosOfInsertion - 1, 0, insertionGaps);
        for (
          let posI = otherI + 1;
          posI < sortedOtherInsertions.length;
          posI++
        ) {
          sortedOtherInsertions[posI].bpPos += 1;
        }
        sortedOwnInsertionsBp.forEach(insertion => {
          if (bpPosOfInsertion <= insertion.bpPos) {
            insertion.bpPos += 1;
          }
        });
        console.log("other insertions array", sortedOtherInsertions);
        console.log(
          "after adding other seq reads insertions",
          seqReadWithGapsAtStart
        );
        console.log(
          "sorted own insertions bp after adding other seq reads insertions",
          sortedOwnInsertionsBp
        );
      }
    }
    // seqReadWithGapsAtStart = seqReadWithGapsAtStart.join("").split("");
    // console.log("after adding other seq reads insertions & splitting", seqReadWithGapsAtStart);

    // 5) add own insertions to own sequence
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    for (let ownI = 0; ownI < sortedOwnInsertionsBp.length; ownI++) {
      const bpPosOfInsertion = sortedOwnInsertionsBp[ownI].bpPos;
      const nucleotides = sortedOwnInsertionsBp[ownI].nucleotides.join("");
      console.log("joined nucleotides", nucleotides);
      seqReadWithGapsAtStart.splice(bpPosOfInsertion - 1, 0, nucleotides);
      for (let posI = ownI + 1; posI < sortedOwnInsertionsBp.length; posI++) {
        sortedOwnInsertionsBp[posI].bpPos += sortedOwnInsertionsBp[ownI].number;
      }
    }

    // // 5) add own deletions to own sequence (if not found in other seq reads' insertions)
    // // get own deletions
    // let ownDeletions = [];
    // for (
    //   let componentI = 0;
    //   componentI < splitSeqReadChunk.length;
    //   componentI++
    // ) {
    //   if (splitSeqReadChunk[componentI].slice(-1) === "D") {
    //     let bpPosOfDeletion = seqRead.pos;
    //     const numberOfDeletions = Number(
    //       splitSeqReadChunk[componentI].slice(0, -1)
    //     );
    //     for (let i = 0; i < componentI; i++) {
    //       const previousComponentNumber = Number(
    //         splitSeqReadChunk[i].slice(0, -1)
    //       );
    //       bpPosOfDeletion += previousComponentNumber;
    //     }
    //     let deletionInfo = {
    //       // keeping bpPos 1-based
    //       bpPos: bpPosOfDeletion,
    //       number: numberOfDeletions
    //     };
    //     ownDeletions.push(deletionInfo);
    //   }
    // }
    // console.log("own deletions", ownDeletions);
    // // sort deletions by ascending bp pos
    // let sortedOwnD = ownDeletions.sort(function(a, b) {
    //   return a.bpPos - b.bpPos;
    // });
    // console.log("sorted ascending own deletions", sortedOwnD);
    // // add own deletions to own sequence
    // for (let ownD = 0; ownD < sortedOwnD.length; ownD++) {
    //   let deletionIsPresent = otherInsertions.some(e => e.bpPos === sortedOwnD[ownD].bpPos && e.number === sortedOwnD[ownD].number);
    //   if (deletionIsPresent === false) {
    //     seqReadWithGapsAtStart.splice(ownD, 1);
    //     console.log("other seq reads insertions", sortedOwnD);
    //   }
    // }

    console.log("all gaps", seqReadWithGapsAtStart);
    // seqReadWithGapsAtStart is a string "GGGA--GA-C--ACC"
    seqReadsWithGaps.push(seqReadWithGapsAtStart.join(""));
    // seqReadsWithGaps.push(seqReadWithGapsAtStart);
    // seqReadsWithGaps.push("--" + seqRead.seq);
    // seqReadsWithGaps.push(sortedInsertions);
  });
  console.log("joined", seqReadsWithGaps);
  return seqReadsWithGaps;
  // ) add gaps after seq read for ref seq's length = seq read's length
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

// // ) add gaps (from own deletions & other seq reads' insertions)
// for (
//   let i = 0;
//   i < sortedGaps.length &&
//   sortedGaps[i].bpPos <= seqReadWithGapsAtStart.length;
//   i++
// ) {
//   const bpPosOfInsertion = sortedGaps[i].bpPos;
//   const numberOfInsertions = sortedGaps[i].number;
//   // adding gaps at the bp pos
//   let insertionGaps = "";
//   for (let gapI = 0; gapI < numberOfInsertions; gapI++) {
//     insertionGaps += "-";
//   }
//   seqReadWithGapsAtStart.splice(
//     bpPosOfInsertion - 1,
//     0,
//     insertionGaps
//   );
//   for (let posI = i + 1; posI < sortedGaps.length; posI++) {
//     sortedGaps[posI].bpPos += 1;
//   }
//   console.log("changing gaps array", sortedGaps);
//   console.log("seq read", seqReadWithGapsAtStart);
// }
