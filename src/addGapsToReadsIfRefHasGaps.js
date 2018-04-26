// const getAllInsertionsInSeqReads = require("./getAllInsertionsInSeqReads.js");
const insertGapsIntoRefSeq = require("./insertGapsIntoRefSeq.js");
const cigarStringToWithGapsAtDeletions = require("./cigarStringToWithGapsAtDeletions.js");

// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps in sequencing reads where there are gaps in reference sequence
module.exports = function addGapsToReadsIfRefHasGaps(refSeq, seqReads) {
  // allSeqReadsWithGapsAtDelPos is an array ["--GATTGAC", "--GAG-C", "--GAG-CTTACC"...] (sequencing reads with gaps at deletions & aligned at starting bp pos)
  // let allSeqReadsWithGaps = cigarStringToWithGapsAtDeletions(refSeq, seqReads);
  let allSeqReadsWithGapsAtDelPos = [
    "--GATTGAC",
    "--GAGAGAC",
    "GGGAGATCAC",
    "--GATTGAC",
    "--GAG-C",
    "--GAG-CTTACC",
    "-GG---CATTTCC"
  ];
  let allSeqReadsWithGaps = [];
  // refSeqWithGaps is a string "GGGA--GA-C--ACC"
  // const refSeqWithGaps = insertGapsIntoRefSeq(refSeq, seqReads);
  const refSeqWithGaps = "GGGA--GA-C--A---CC";
  const splitRefSeq = refSeqWithGaps.split("");

  for (let i = 0; i < allSeqReadsWithGapsAtDelPos.length; i++) {
    // turn seq read with its own deletion gaps into an array ["A", "-", "T", "C", "-", "-", "G"...]
    let splitSeqRead = allSeqReadsWithGapsAtDelPos[i].split("");
    // split seq read's cigar string at M, D, or I (match, deletion, or insertion), e.g. ["2M", "3I", "39M", "3D"...]
    const splitSeqReadChunk = seqReads[i].cigar.match(/([0-9]*[MDI])/g);
    let insertionsInSeqRead = [];
    splitSeqReadChunk.forEach(component => {
      if (component.slice(-1) === "I") {
        let bpPosOfInsertion = seqReads[i].pos;
        const numberOfInsertions = Number(component.slice(0, -1));
        const componentIndex = splitSeqReadChunk.indexOf(component);
        for (let chunkI = 0; chunkI < componentIndex; chunkI++) {
          const previousComponentNumber = Number(
            splitSeqReadChunk[chunkI].slice(0, -1)
          );
          bpPosOfInsertion += previousComponentNumber;
        }
        for (let i = 1; i <= numberOfInsertions; i++) {
          insertionsInSeqRead.push(bpPosOfInsertion - i);
        }
      }
    });
    // const ascendInsertionBpPos = insertionsInSeqRead.sort(function(a, b) { return a - b });
    for (let innerI = 0; innerI < splitSeqRead.length; innerI++) {
      if (
        splitRefSeq[innerI] === "-" &&
        splitSeqRead[innerI] !== "-" &&
        splitSeqRead[innerI] !== "T"
      ) {
        // if (splitRefSeq[innerI] === "-" && splitSeqRead[innerI] !== "-" && ascendInsertionBpPos.includes(innerI) === false) {
        splitSeqRead.splice(innerI, 0, "-");
        // ascendInsertionBpPos.forEach(element => { element += 1 });
      }
    }
    allSeqReadsWithGaps.push(splitSeqRead.join(""));
  }
  return allSeqReadsWithGaps;
};

// allSeqReadsWithGapsAtDelPos.forEach(seqRead => {
//   let splitSeqRead = seqRead.split("");
//   for (let i = 0; i < splitSeqRead.length; i++) {
//     if (splitRefSeq[i] === "-" && splitSeqRead[i] !== "-" && splitSeqRead[i] !== "T") {
//       splitSeqRead.splice(i, 0, "-");
//     }
//   }
//   allSeqReadsWithGaps.push(splitSeqRead.join(""));
// });
// return allSeqReadsWithGaps;

// let insertionInfo = {
//   // keeping bpPos 1-based
//   bpPos: bpPosOfInsertion,
//   number: numberOfInsertions
// }
// // insertionsInSeqRead is an array of objects [{bpPos: bp pos of insertion, number: # of insertions}, {bpPos, number}, ...]
// insertionsInSeqRead.push(insertionInfo);
