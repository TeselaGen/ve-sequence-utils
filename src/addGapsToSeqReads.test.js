const addGapsToSeqReads = require("./addGapsToSeqReads.js");

describe("add gaps into sequencing reads before starting bp pos and from own deletions & other seq reads' insertions", function() {
  it("seq reads with gaps", function() {
    const refSeq = "GGGAGACACC";
    const seqReads = [
      { name: "r1", seq: "GATTGAC", pos: 3, cigar: "2M2I3M" },
      { name: "r2", seq: "GAGAGAC", pos: 3, cigar: "7M" },
      { name: "r3", seq: "GGGAGATCAC", pos: 1, cigar: "6M1I3M" },
      { name: "r4", seq: "GATTGAC", pos: 3, cigar: "2M2I3M" },
      { name: "r5", seq: "GAGC", pos: 3, cigar: "3M1D1M" },
      { name: "r6", seq: "GAGCTTACC", pos: 3, cigar: "3M1D1M2I3M" },
      { name: "r7", seq: "GGCATTTCC", pos: 2, cigar: "2M3D2M3I2M" },
      { name: "r8", seq: "GGATTGACATT", pos: 1, cigar: "1D3M2I4M2I2D" },
      { name: "r9", seq: "GGTTTGACCTTT", pos: 1, cigar: "2M3I2D1M2D3M3I" }
    ];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([
      "-----GATTGA-C-----------",
      "-----GA--GA-G--A---C----",
      "GG---GA--GATC--A---C----",
      "-----GATTGA-C-----------",
      "-----GA--G--C-----------",
      "-----GA--G--CTTA---CC---",
      "-G---G------C--ATTTCC---",
      "-G---GATTGA-C--A-TT-----",
      "GGTTT----G-----A---CCTTT"

      // "GGTTT--G--ACCTTT"

      // "--GATTGA-C",
      // "--GA--GA-G--A---C",
      // "GGGA--GATC--A---C",
      // "--GATTGA-C",
      // "--GA--G--C",
      // "--GA--G--CTTA---CC",
      // "-GG------C--ATTTCC",
      // "-GGATTGA-C--A-TT--"
    ]);
    // expect(result).toEqual(["--GATTGA-C", "--GA--GA-G--A---C", "GGGA--GATC--A---C", "--GATTGA-C", "--GA--G--C", "--GA--G--CTTA---CC", "-GG------C--ATTTCC"]);
  });
});
