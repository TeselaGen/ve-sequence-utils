// const getAllInsertionsInSeqReads = require("./getAllInsertionsInSeqReads.js");
const insertGapsIntoRefSeq = require("./insertGapsIntoRefSeq.js");

// bam.seq: NTGTAAGTCGTGAAAAAANCNNNCATATTNCGGAGGTAAAAATGAAAA...
// bam.pos: 43
// bam.cigar: 36M2D917M3I17M7I2M1I6M5I4M1D6M12I8M
// (note: bam.cigar is null if the sequencing read is unaligned)

// refSeq should be an object { name, sequence }
// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps into sequencing reads before starting bp pos and from own deletions & all seq reads' insertions, minus own insertions
module.exports = function addGapsToSeqReads(refSeq, seqReads) {
  // remove unaligned seq reads for now
  for (let i = 0; i < seqReads.length; i++) {
    if (seqReads[i].cigar === null) {
      seqReads.splice(i, 1);
    }
  }

  const refSeqWithGaps = insertGapsIntoRefSeq(refSeq.sequence, seqReads);
  // console.log("ref seq with gaps", refSeqWithGaps.toUpperCase())
  // first object is reference sequence with gaps, to be followed by seq reads with gaps
  let seqReadsWithGaps = [
    { name: refSeq.name, sequence: refSeqWithGaps.toUpperCase() }
  ];
  // const seqRead = seqReads[0];
  // console.log("seq read", seqRead);
  seqReads.forEach(seqRead => {
    // get all insertions in seq reads
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
    // console.log("all insertions", allInsertions);
    // allInsertionsInSeqReads = [{"bpPos": 5, "number": 2}, {"bpPos": 7, "number": 1}, {"bpPos": 8, "number": 2}, {"bpPos": 9, "number": 3}];
    // let allInsertionsInSeqReads = allInsertions;
    // console.log("allInsertionsInSeqReads", allInsertionsInSeqReads);

    // 1) add gaps before starting bp pos
    // turn seq read into an array ["A", "T", "C", "G"...]
    let eachSeqReadWithGaps = seqRead.seq.split("");
    // add gaps before the sequencing read based on starting bp pos of alignment
    // for (let i = 1; i < seqRead.pos; i++) {
    //   eachSeqReadWithGaps.unshift("-");
    // }
    eachSeqReadWithGaps.unshift("-".repeat(seqRead.pos - 1));
    eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
    // console.log("add gaps before starting bp pos", eachSeqReadWithGaps);

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
    // console.log("own deletions", ownDeletions);
    // sort deletions by ascending bp pos
    let sortedOwnDeletions = ownDeletions.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    // console.log("sorted ascending own deletions", sortedOwnDeletions);
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
      eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
      // console.log("sorted own deletions", sortedOwnDeletions);
      // console.log("after adding own deletions", eachSeqReadWithGaps);
    }
    eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
    // console.log("after adding own deletions & splitting", eachSeqReadWithGaps);

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
    let ownInsertionsCompare = JSON.parse(JSON.stringify(ownInsertions));
    // console.log("own insertions", ownInsertions);
    // console.log("own insertions bp", ownInsertionsBp);
    // console.log("own insertions compare", ownInsertionsCompare);
    // sort own insertions by ascending bp pos
    let sortedOwnInsertions = ownInsertions.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    let sortedOwnInsertionsBp = ownInsertionsBp.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    // console.log("sorted ascending own insertions", sortedOwnInsertions);
    // console.log("sorted ascending own insertions bp", sortedOwnInsertionsBp);
    // console.log("own insertions compare", ownInsertionsCompare);
    // remove own insertions from own sequence
    for (let ownI = 0; ownI < sortedOwnInsertions.length; ownI++) {
      const bpPosOfInsertion = sortedOwnInsertions[ownI].bpPos;
      const numberOfInsertions = sortedOwnInsertions[ownI].number;
      for (let numI = 0; numI < numberOfInsertions; numI++) {
        eachSeqReadWithGaps.splice(bpPosOfInsertion - 1, 1);
      }
      for (let posI = ownI + 1; posI < sortedOwnInsertions.length; posI++) {
        sortedOwnInsertions[posI].bpPos -= numberOfInsertions;
        // sortedOwnInsertionsBp[posI].bpPos -= numberOfInsertions;
      }
      // console.log("sorted own insertions", sortedOwnInsertions);
      // console.log("after removing own insertions", eachSeqReadWithGaps);
    }
    // console.log("sorted ascending own insertions", sortedOwnInsertions);
    // console.log("sorted ascending own insertions bp", sortedOwnInsertionsBp);
    // console.log("own insertions compare", ownInsertionsCompare);

    // 4) add other seq reads' insertions to seq read
    // get other seq reads' insertions (i.e. all insertions minus duplicates minus own insertions)
    let otherInsertions = allInsertionsInSeqReads.sort(function(a, b) {
      return a.bpPos - b.bpPos;
    });
    // console.log("all insertions to other insertions", otherInsertions);
    // combine duplicates within all insertions, remove own insertions from all insertions, combine overlap between other insertions & own insertions
    // combine duplicates within all insertions
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
    // console.log("all insertions to other insertions, w/o duplicates", otherInsertions);
    // console.log("own insertions compare", ownInsertionsCompare);
    // console.log("own insertions", ownInsertions);
    // console.log("own insertions bp", ownInsertionsBp);
    // remove own insertions from all insertions
    for (let otherI = 0; otherI < ownInsertionsCompare.length; otherI++) {
      let insertionInfoIndex = otherInsertions.findIndex(
        e => e.bpPos === ownInsertionsCompare[otherI].bpPos
      );
      // console.log("otherI", otherI)
      if (insertionInfoIndex !== -1) {
        // console.log("I, ownInsertionsCompare[otherI]", otherI, ownInsertionsCompare[otherI])
        if (
          otherInsertions[insertionInfoIndex].number >
          ownInsertionsCompare[otherI].number
        ) {
          otherInsertions[insertionInfoIndex].number =
            otherInsertions[insertionInfoIndex].number -
            ownInsertionsCompare[otherI].number;
        } else if (
          otherInsertions[insertionInfoIndex].number <=
          ownInsertionsCompare[otherI].number
        ) {
          otherInsertions.splice(insertionInfoIndex, 1);
          otherI--;
        }
      }
      // console.log("insertionInfoIndex", insertionInfoIndex);
      // console.log("other seq reads insertions", otherInsertions);
    }
    // combine overlap between other insertions & own insertions
    for (let overlapI = 0; overlapI < sortedOwnInsertions.length; overlapI++) {
      let insertionInfoIndex = otherInsertions.findIndex(
        e => e.bpPos === sortedOwnInsertions[overlapI].bpPos
      );
      if (insertionInfoIndex !== -1) {
        if (
          otherInsertions[insertionInfoIndex].number >
          sortedOwnInsertions[overlapI].number
        ) {
          otherInsertions[insertionInfoIndex].number =
            otherInsertions[insertionInfoIndex].number -
            sortedOwnInsertions[overlapI].number;
        } else if (
          otherInsertions[insertionInfoIndex].number <=
          sortedOwnInsertions[overlapI].number
        ) {
          otherInsertions.splice(insertionInfoIndex, 1);
          overlapI--;
        }
      }
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
        // console.log("number", adjustedOwnInsertionsBp[i].number);
        // console.log("bp pos", adjustedOwnInsertionsBp[i].bpPos);
        // console.log("previous inserts", previousInserts);
      }
      adjustedOwnInsertionsBp[ownI].bpPos =
        adjustedOwnInsertionsBp[ownI].bpPos - previousInserts;
      sortedOwnInsertionsBp[ownI].bpPos =
        sortedOwnInsertionsBp[ownI].bpPos - previousInserts;
      // console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    }
    // console.log("sorted own insertions", sortedOwnInsertionsBp);
    // console.log("other insertions", otherInsertions);
    // console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    for (let otherI = 0; otherI < otherInsertions.length; otherI++) {
      for (let ownI = 0; ownI < adjustedOwnInsertionsBp.length; ownI++) {
        if (
          otherInsertions[otherI].bpPos <= sortedOwnInsertionsBp[ownI].bpPos
        ) {
          adjustedOwnInsertionsBp[ownI].bpPos += 1;
          // console.log("other insertions at other I", otherInsertions[otherI].bpPos);
          // console.log("sorted own insertions at own I", sortedOwnInsertionsBp[ownI].bpPos);
          // console.log("adjusted own insertions at own I",adjustedOwnInsertionsBp[ownI].bpPos);
        }
      }
    }
    // console.log("adjusted own insertions", adjustedOwnInsertionsBp);
    // add other seq reads' insertions to sequence
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    // console.log("other insertions array before", otherInsertions);
    for (
      let otherI = 0;
      otherI < otherInsertions.length &&
      otherInsertions[otherI].bpPos <= eachSeqReadWithGaps.length;
      otherI++
    ) {
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
      // console.log("other insertions array after", otherInsertions);
      // console.log("after adding other seq reads insertions", eachSeqReadWithGaps);
    }

    // 5) add own insertions to own sequence
    // sortedOwnInsertionsBp = [ { bpPos: 9, number: 3, nucleotides: [ 'T', 'T', 'T' ] } ]
    // console.log("adjustedOwnInsertionsBp", adjustedOwnInsertionsBp);
    for (let ownI = 0; ownI < adjustedOwnInsertionsBp.length; ownI++) {
      const bpPosOfInsertion = adjustedOwnInsertionsBp[ownI].bpPos;
      const nucleotides = adjustedOwnInsertionsBp[ownI].nucleotides.join("");
      // console.log("joined nucleotides", nucleotides);
      eachSeqReadWithGaps.splice(bpPosOfInsertion - 1, 0, nucleotides);
      // console.log("eachSeqReadWithGaps", eachSeqReadWithGaps)
      // for (let posI = ownI + 1; posI < adjustedOwnInsertionsBp.length; posI++) {
      //   adjustedOwnInsertionsBp[posI].bpPos += adjustedOwnInsertionsBp[ownI].number;
      // }
    }

    // 6) add gaps after seq read for ref seq's length = seq read's length
    // console.log("seq read length", eachSeqReadWithGaps.length)
    // console.log("ref seq w/gaps length", refSeqWithGaps.length)
    // console.log("ref seq w/gaps", refSeqWithGaps)
    eachSeqReadWithGaps = eachSeqReadWithGaps.join("").split("");
    if (eachSeqReadWithGaps.length < refSeqWithGaps.length) {
      eachSeqReadWithGaps.push(
        "-".repeat(refSeqWithGaps.length - eachSeqReadWithGaps.length)
      );
    }

    // console.log("all gaps", eachSeqReadWithGaps);
    // eachSeqReadWithGaps is a string "GGGA--GA-C--ACC"
    seqReadsWithGaps.push({
      name: seqRead.name,
      sequence: eachSeqReadWithGaps.join("")
    });
  });
  // console.log("joined", seqReadsWithGaps);
  // seqReadsWithGaps is an array of objects containing the ref seq with gaps first and then all seq reads with gaps
  // e.g. [{ name: "ref seq", sequence: "GG---GA--GA-C--A---CC---"}, { name: "r1", sequence: "-----GATTGA-C-----------"}...]
  return seqReadsWithGaps;
};
