// bam.seq: NTGTAAGTCGTGAAAAAANCNNNCATATTNCGGAGGTAAAAATGAAAA...
// bam.pos: 43
// bam.cigar: 36M2D917M3I17M7I2M1I6M5I4M1D6M12I8M
// (note: bam.cigar is null if the sequencing read is unaligned)

// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps into sequencing reads before starting bp pos and from own deletions & all seq reads' insertions, minus own insertions
module.exports = function addGapsToSeqReads(seqReads) {
  let seqReadsWithGaps = [];
  // const seqRead = seqReads[7];
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
    let eachSeqReadWithGaps = seqRead.seq.split("");
    // add gaps before the sequencing read based on starting bp pos of alignment
    for (let i = 1; i < seqRead.pos; i++) {
      eachSeqReadWithGaps.unshift("-");
    }
    console.log("add gaps before starting bp pos", eachSeqReadWithGaps);

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
      eachSeqReadWithGaps.splice(bpPosOfDeletion - 1, 0, deletionGaps);
      for (let posD = ownD + 1; posD < sortedOwnDeletions.length; posD++) {
        sortedOwnDeletions[posD].bpPos += 1;
      }
      console.log("sorted own deletions", sortedOwnDeletions);
      console.log("after adding own deletions", eachSeqReadWithGaps);
    }
    eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
    console.log("after adding own deletions & splitting", eachSeqReadWithGaps);

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
          nucleotides.push(eachSeqReadWithGaps[bpPosOfInsertion - 1 + nucI]);
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
        eachSeqReadWithGaps.splice(bpPosOfInsertion - 1, 1);
      }
      for (let posI = ownI + 1; posI < sortedOwnInsertions.length; posI++) {
        sortedOwnInsertions[posI].bpPos -= numberOfInsertions;
      }
      console.log("sorted own insertions", sortedOwnInsertions);
      console.log("after removing own insertions", eachSeqReadWithGaps);
    }

    // 4) add other seq reads' insertions to seq read
    // get other seq reads' insertions (i.e. all insertions minus duplicates minus own insertions)
    let otherInsertions = allInsertionsInSeqReads.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    console.log("all insertions to other insertions", otherInsertions);
    // combine duplicates or overlap
    // 'i < otherInsertions.length - 1' because when at the end of the array, there is no 'i + 1' to compare to
    for (let i = 0; i < otherInsertions.length - 1; i++) {
      while (otherInsertions[i].bpPos === otherInsertions[i + 1].bpPos) {
        if (otherInsertions[i].number > otherInsertions[i + 1].number) {
          // remove the one with fewer number of gaps from array
          otherInsertions.splice(i + 1, 1);
        } else if (otherInsertions[i].number < otherInsertions[i + 1].number) {
          otherInsertions.splice(i, 1);
        } else if (
          otherInsertions[i].number === otherInsertions[i + 1].number
        ) {
          otherInsertions.splice(i, 1);
        }
      }
    }
    console.log(
      "all insertions to other insertions, w/o duplicates",
      otherInsertions
    );
    console.log("own insertions", ownInsertions);
    for (let otherI = 0; otherI < ownInsertions.length; otherI++) {
      let insertionInfoIndex = otherInsertions.findIndex(
        e => e.bpPos === ownInsertions[otherI].bpPos
        // e.number === ownInsertions[otherI].number
      );
      if (insertionInfoIndex !== -1) {
        if (
          otherInsertions[insertionInfoIndex].number >
          ownInsertions[otherI].number
        ) {
          otherInsertions[insertionInfoIndex].number =
            otherInsertions[insertionInfoIndex].number -
            ownInsertions[otherI].number;
        } else if (
          otherInsertions[insertionInfoIndex].number <=
          ownInsertions[otherI].number
        ) {
          otherInsertions.splice(insertionInfoIndex, 1);
          otherI--;
        }
      }
      console.log("insertionInfoIndex", insertionInfoIndex);
      console.log("other seq reads insertions", otherInsertions);
    }
    // adjust own insertions according to other seq reads' insertions to be added (i.e. for all other reads' insertions with smaller bp pos, +1 to that own insertion's bp pos)
    let adjustedOwnInsertionsBp = JSON.parse(
      JSON.stringify(sortedOwnInsertionsBp)
    );
    // let adjustedOwnInsertionsBp = [ { bpPos: 8, number: 2, nucleotides: [ 'T', 'T' ] } ];
    for (let ownI = 0; ownI < adjustedOwnInsertionsBp.length; ownI++) {
      let previousInserts = 0;
      for (let i = 0; i < ownI; i++) {
        previousInserts += adjustedOwnInsertionsBp[i].number - 1;
        previousInserts += sortedOwnInsertionsBp[i].number - 1;
        console.log("number", adjustedOwnInsertionsBp[i].number);
        console.log("bp pos", adjustedOwnInsertionsBp[i].bpPos);
        console.log("previous inserts", previousInserts);
      }
      adjustedOwnInsertionsBp[ownI].bpPos =
        adjustedOwnInsertionsBp[ownI].bpPos - previousInserts;
      console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    }
    console.log("sorted own insertions", sortedOwnInsertionsBp);
    console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    for (let otherI = 0; otherI < otherInsertions.length; otherI++) {
      for (let ownI = 0; ownI < adjustedOwnInsertionsBp.length; ownI++) {
        if (
          otherInsertions[otherI].bpPos <= sortedOwnInsertionsBp[ownI].bpPos
        ) {
          adjustedOwnInsertionsBp[ownI].bpPos += 1;
          console.log(
            "other insertions at other I",
            otherInsertions[otherI].bpPos
          );
          console.log(
            "sorted own insertions at own I",
            sortedOwnInsertionsBp[ownI].bpPos
          );
          console.log(
            "adjusted own insertions at own I",
            adjustedOwnInsertionsBp[ownI].bpPos
          );
        }
      }
    }
    console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    // add other seq reads' insertions to sequence
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    for (
      let otherI = 0;
      otherI < otherInsertions.length &&
      otherInsertions[otherI].bpPos <= eachSeqReadWithGaps.length;
      otherI++
    ) {
      // let insertionIsPresent = sortedOwnInsertions.some(
      //   e =>
      //     e.bpPos === otherInsertions[otherI].bpPos &&
      //     e.number === otherInsertions[otherI].number
      // );
      // if (insertionIsPresent === false) {
      const bpPosOfInsertion = otherInsertions[otherI].bpPos;
      const numberOfInsertions = otherInsertions[otherI].number;
      // adding gaps at the bp pos
      let insertionGaps = "";
      for (let gapI = 0; gapI < numberOfInsertions; gapI++) {
        insertionGaps += "-";
      }
      eachSeqReadWithGaps.splice(bpPosOfInsertion - 1, 0, insertionGaps);
      for (let posI = otherI + 1; posI < otherInsertions.length; posI++) {
        otherInsertions[posI].bpPos += 1;
      }
      console.log("other insertions array", otherInsertions);
      console.log(
        "after adding other seq reads insertions",
        eachSeqReadWithGaps
      );
      // console.log(
      //   "sorted own insertions bp after adding other seq reads insertions",
      //   sortedOwnInsertionsBp
      // );
      // }
    }
    // eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
    // console.log("after adding other seq reads insertions & splitting", eachSeqReadWithGaps);

    // 5) add own insertions to own sequence
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    for (let ownI = 0; ownI < adjustedOwnInsertionsBp.length; ownI++) {
      const bpPosOfInsertion = adjustedOwnInsertionsBp[ownI].bpPos;
      const nucleotides = adjustedOwnInsertionsBp[ownI].nucleotides.join("");
      console.log("joined nucleotides", nucleotides);
      eachSeqReadWithGaps.splice(bpPosOfInsertion - 1, 0, nucleotides);
      // for (let posI = ownI + 1; posI < adjustedOwnInsertionsBp.length; posI++) {
      //   adjustedOwnInsertionsBp[posI].bpPos += adjustedOwnInsertionsBp[ownI].number;
      // }
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
    //     eachSeqReadWithGaps.splice(ownD, 1);
    //     console.log("other seq reads insertions", sortedOwnD);
    //   }
    // }

    console.log("all gaps", eachSeqReadWithGaps);
    // eachSeqReadWithGaps is a string "GGGA--GA-C--ACC"
    seqReadsWithGaps.push(eachSeqReadWithGaps.join(""));
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
//   sortedGaps[i].bpPos <= eachSeqReadWithGaps.length;
//   i++
// ) {
//   const bpPosOfInsertion = sortedGaps[i].bpPos;
//   const numberOfInsertions = sortedGaps[i].number;
//   // adding gaps at the bp pos
//   let insertionGaps = "";
//   for (let gapI = 0; gapI < numberOfInsertions; gapI++) {
//     insertionGaps += "-";
//   }
//   eachSeqReadWithGaps.splice(
//     bpPosOfInsertion - 1,
//     0,
//     insertionGaps
//   );
//   for (let posI = i + 1; posI < sortedGaps.length; posI++) {
//     sortedGaps[posI].bpPos += 1;
//   }
//   console.log("changing gaps array", sortedGaps);
//   console.log("seq read", eachSeqReadWithGaps);
// }
