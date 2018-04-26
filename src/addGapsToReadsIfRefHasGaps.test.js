// const addGapsToReadsIfRefHasGaps = require("./addGapsToReadsIfRefHasGaps.js");

// describe("add gaps in sequencing reads where there are gaps in reference sequence", function() {
//   it("seq read with other seq reads' insertions", function() {
//     const refSeq = "GGGAGACACC";
//     const seqReads = [{name: "r1", seq: "GATTGAC", pos: 3, cigar: "2M2I3M"}, {name: "r2", seq: "GAGAGAC", pos: 3, cigar: "7M"}, {name: "r3", seq: "GGGAGATCAC", pos: 1, cigar: "6M1I3M"}, {name: "r4", seq: "GATTGAC", pos: 3, cigar: "2M2I3M"}, {name: "r5", seq: "GAGC", pos: 3, cigar: "3M1D1M"}, {name: "r6", seq: "GAGCTTACC", pos: 3, cigar: "3M1D1M2I3M"}, {name: "r7", seq: "GGCATTTCC", pos: 2, cigar: "2M3D2M3I2M"}];
//     const result = addGapsToReadsIfRefHasGaps(refSeq, seqReads);
//     expect(result).toEqual(["--GATTGA-C", "--GA--GA-G--A---C", "GGGA--GATC--A---C", "--GATTGA-C", "--GA--G--C", "--GA--G--CTTA---CC", "-GG------C--ATTTCC"]);
//   });
// });
