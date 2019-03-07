import addGapsToSeqReads from './addGapsToSeqReads.js';
describe("cigar strings to gapped alignments", function () {
  it("adds gaps into sequencing reads before starting bp pos and from own deletions & other seq reads' insertions", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGGAGACACC"
    };
    const seqReads = [{
      name: "r1",
      seq: "GATTGAC",
      pos: 3,
      cigar: "2M2I3M"
    }, {
      name: "r2",
      seq: "GAGAGAC",
      pos: 3,
      cigar: "7M"
    }, {
      name: "r3",
      seq: "GGGAGATCAC",
      pos: 1,
      cigar: "6M1I3M"
    }, {
      name: "r4",
      seq: "GATTGAC",
      pos: 3,
      cigar: "2M2I3M"
    }, {
      name: "r5",
      seq: "GAGC",
      pos: 3,
      cigar: "3M1D1M"
    }, {
      name: "r6",
      seq: "GAGCTTACC",
      pos: 3,
      cigar: "3M1D1M2I3M"
    }, {
      name: "r7",
      seq: "GGCATTTCC",
      pos: 2,
      cigar: "2M3D2M3I2M"
    }, {
      name: "r8",
      seq: "GGATTGACATT",
      pos: 1,
      cigar: "1D3M2I4M2I2D"
    }, {
      name: "r9",
      seq: "GGTTTGACCTTT",
      pos: 1,
      cigar: "2M3I2D1M2D3M3I"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GG---GA--GA-C--A---CC---"
    }, // then seq reads
    {
      name: "r1",
      sequence: "-----GATTGA-C-----------"
    }, {
      name: "r2",
      sequence: "-----GA--GA-G--A---C----"
    }, {
      name: "r3",
      sequence: "GG---GA--GATC--A---C----"
    }, {
      name: "r4",
      sequence: "-----GATTGA-C-----------"
    }, {
      name: "r5",
      sequence: "-----GA--G--C-----------"
    }, {
      name: "r6",
      sequence: "-----GA--G--CTTA---CC---"
    }, {
      name: "r7",
      sequence: "-G---G------C--ATTTCC---"
    }, {
      name: "r8",
      sequence: "-G---GATTGA-C--A-TT-----"
    }, {
      name: "r9",
      sequence: "GGTTT----G-----A---CCTTT"
    }]);
  });
  it("removes unaligned seq reads (seqRead.pos = 0, seqRead.cigar = null)", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    };
    const seqReads = [{
      name: "r1",
      seq: "GAAGCAAGGGACSSSSS",
      pos: 13,
      cigar: "12M5S"
    }, {
      name: "r2",
      seq: "ZZZZZ",
      pos: 0,
      cigar: null
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG---"
    }, // then seq reads
    {
      name: "r1",
      sequence: "------------GAAGCAAGGGACSSSSS"
    }]);
  });
  it("adjusts bp pos of alignment with the ref seq (seqRead.pos) if there are soft-clipped reads at the beginning of a seq read (#S at start of seqRead.cigar)...seq read aligned near the beginning of the ref seq", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGGAGACACC"
    };
    const seqReads = [{
      name: "r1",
      seq: "SSGATTGAC",
      pos: 3,
      cigar: "2S2M2I3M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGGA--GACACC"
    }, // then seq reads
    {
      name: "r1",
      sequence: "SSGATTGAC---"
    }]);
  });
  it("adjusts bp pos of alignment with the ref seq (seqRead.pos) if there are soft-clipped reads at the beginning of a seq read (#S at start of seqRead.cigar)...seq read aligned near the middle of the ref seq", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    };
    const seqReads = [{
      name: "r1",
      seq: "SSSGAAGCAAG",
      pos: 13,
      cigar: "3S8M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    }, // then seq reads
    {
      name: "r1",
      sequence: "---------SSSGAAGCAAG------"
    }]);
  });
  it("adjusts bp pos of alignment with the ref seq (seqRead.pos) if there are soft-clipped reads at the beginning of a seq read (#S at start of seqRead.cigar)...multiple seq reads with #S at the start", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    };
    const seqReads = [{
      name: "r1",
      seq: "SSACTTCGGAACAGGAAG",
      pos: 3,
      cigar: "2S2M2I12M"
    }, {
      name: "r2",
      seq: "SSSGAAGCAAG",
      pos: 13,
      cigar: "3S8M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGAC--CGGAACAGGAAGCAAGGGACAG"
    }, // then seq reads
    {
      name: "r1",
      sequence: "SSACTTCGGAACAGGAAG----------"
    }, {
      name: "r2",
      sequence: "-----------SSSGAAGCAAG------"
    }]);
  });
  it("adjusts bp pos of alignment with the ref seq (seqRead.pos) if there are soft-clipped reads at the beginning of a seq read (#S at start of seqRead.cigar)...soft-clipped reads before the beginning of the ref seq", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGGAGACACC"
    };
    const seqReads = [{
      name: "r1",
      seq: "SSSGGGATTGAC",
      pos: 1,
      cigar: "3S4M2I3M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "---GGGA--GACACC"
    }, // then seq reads
    {
      name: "r1",
      sequence: "SSSGGGATTGAC---"
    }]);
  });
  it("works with soft-clipped reads at the end of a seq read (#S at end of seqRead.cigar)", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    };
    const seqReads = [{
      name: "r1",
      seq: "GAAGCAAGSSS",
      pos: 13,
      cigar: "12M5S"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    }, // then seq reads
    {
      name: "r1",
      sequence: "------------GAAGCAAGSSS---"
    }]);
  });
  it("accounts for soft-clipped reads at the end of a seq read (#S at end of seqRead.cigar) that make seqRead.sequence longer than refSeq.sequence, by making ref seq & seq reads all the same/longest length", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG"
    };
    const seqReads = [{
      name: "r1",
      seq: "GAAGCAAGGGACSSSSS",
      pos: 13,
      cigar: "12M5S"
    }, {
      name: "r2",
      seq: "GCAAG",
      pos: 16,
      cigar: "5M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "GGACCGGAACAGGAAGCAAGGGACAG---"
    }, // then seq reads
    {
      name: "r1",
      sequence: "------------GAAGCAAGGGACSSSSS"
    }, {
      name: "r2",
      sequence: "---------------GCAAG---------"
    }]);
  });
  it("adjusts bp pos of alignment with the ref seq (seqRead.pos) if there are soft-clipped reads at the beginning of a seq read (#S at start of seqRead.cigar)...soft-clipped reads before the beginning of the ref seq", function () {
    const refSeq = {
      name: "ref seq",
      sequence: "GGGAGACACC"
    };
    const seqReads = [{
      name: "r1",
      seq: "SSSGGGATTGAC",
      pos: 1,
      cigar: "3S4M2I3M"
    }, {
      name: "r2",
      seq: "GGAGAC",
      pos: 2,
      cigar: "6M"
    }, {
      name: "r3",
      seq: "SSGGGATTGAC",
      pos: 1,
      cigar: "2S4M2I3M"
    }, {
      name: "r4",
      seq: "SSCAC",
      pos: 7,
      cigar: "2S3M"
    }, {
      name: "r5",
      seq: "SSSSSCAC",
      pos: 7,
      cigar: "5S3M"
    }];
    const result = addGapsToSeqReads(refSeq, seqReads);
    expect(result).toEqual([// ref seq first
    {
      name: "ref seq",
      sequence: "---GGGA--GACACC"
    }, // then seq reads
    {
      name: "r1",
      sequence: "SSSGGGATTGAC---"
    }, {
      name: "r2",
      sequence: "----GGA--GAC---"
    }, {
      name: "r3",
      sequence: "-SSGGGATTGAC---"
    }, {
      name: "r4",
      sequence: "---------SSCAC-"
    }, {
      name: "r5",
      sequence: "----SSS--SSCAC-"
    }]);
  });
});