// bam.seq: NTGTAAGTCGTGAAAAAANCNNNCATATTNCGGAGGTAAAAATGAAAA...
// bam.pos: 43
// bam.cigar: 36M2D917M3I17M7I2M1I6M5I4M1D6M12I8M
// (note: bam.cigar is null if the sequencing read is unaligned)

// seqReads should be an array of objects [{name, seq, pos, cigar}, {name, seq, pos, cigar}, ...]
// add gaps in sequencing reads where there are deletions & add gaps in front before starting bp pos
module.exports = function cigarStringToWithGapsAtDeletions(refSeq, seqReads) {
  let allSeqReadsWithGapsAtDelPos = [];
  seqReads.forEach(seqRead => {
    let seqReadWithGapsAtDelPos = seqRead.seq.split("");
    // add gaps before the sequencing read based on starting bp pos of alignment
    for (let i = 1; i < seqRead.pos; i++) {
      seqReadWithGapsAtDelPos.unshift("-");
    }
    // split cigar string at M, D, or I (match, deletion, or insertion)
    // ["2M", "3I", "39M", "3D"...]
    const splitSeqRead = seqRead.cigar.match(/([0-9]*[MDI])/g);
    splitSeqRead.forEach(component => {
      // add gaps in sequencing read where there are deletions
      if (component.slice(-1) === "D") {
        let bpPosOfDeletion = seqRead.pos;
        const numberOfDeletions = Number(component.slice(0, -1));
        const componentIndex = splitSeqRead.indexOf(component);
        for (let i = 0; i < componentIndex; i++) {
          let previousComponentNumber = Number(splitSeqRead[i].slice(0, -1));
          bpPosOfDeletion += previousComponentNumber;
        }
        // adding gaps at the bp pos of deletion
        let deletionGaps = "";
        for (let i = 0; i < numberOfDeletions; i++) {
          deletionGaps += "-";
        }
        seqReadWithGapsAtDelPos.splice(bpPosOfDeletion - 1, 0, deletionGaps);
      }
    });
    // allSeqReadsWithGapsAtDelPos is an array ["--GATTGAC", "--GAG-C", "--GAG-CTTACC"...]
    allSeqReadsWithGapsAtDelPos.push(seqReadWithGapsAtDelPos.join(""));
  });
  return allSeqReadsWithGapsAtDelPos;
};

// // add gaps after the sequencing read for template's length = sequencing read's length
// for (let i = seqReadWithGapsAtDelPos.length; i < refSeq.length; i++) {
//   seqReadWithGapsAtDelPos.push("-");
// }
