const getAllInsertionsInSeqReads = require("./getAllInsertionsInSeqReads.js");

describe("get bp pos of all insertions in seq reads after bowtie2 alignment", function() {
  it("allInsertionsInSeqReads should be an array of objects [{bpPos: bp pos of insertion, number: # of insertions}, {bpPos, number}, ...]", function() {
    const seqReads = [
      { name: "r1", seq: "GATTGAC", pos: 3, cigar: "2M2I3M" },
      { name: "r2", seq: "GAGAGAC", pos: 3, cigar: "7M" },
      { name: "r3", seq: "GGGAGATCAC", pos: 1, cigar: "6M1I3M" },
      { name: "r4", seq: "GATTGAC", pos: 3, cigar: "2M2I3M" },
      { name: "r5", seq: "GAGC", pos: 3, cigar: "3M1D1M" },
      { name: "r6", seq: "GAGCTTACC", pos: 3, cigar: "3M1D1M2I3M" },
      { name: "r7", seq: "GGCATTTCC", pos: 2, cigar: "2M3D2M3I2M" }
    ];
    const result = getAllInsertionsInSeqReads(seqReads);
    expect(result).toEqual([
      { bpPos: 5, number: 2 },
      { bpPos: 7, number: 1 },
      { bpPos: 8, number: 2 },
      { bpPos: 9, number: 3 }
    ]);
    // expect(result).toEqual([{"bpPos": 5, "number": 2}, {"bpPos": 7, "number": 1}, {"bpPos": 8, "number": 2}]);
    // expect(result).toEqual([5, 6, 7, 8, 9]);
  });
});
