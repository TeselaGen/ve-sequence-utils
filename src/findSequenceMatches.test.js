const findSequenceMatches = require("./findSequenceMatches");

describe("findSequenceMatches", function() {
  it("returns an empty array when nothing matches", function() {
    expect([]).toEqual(findSequenceMatches("atg", "xtag"));
  });
  it("handles various weird characters", function() {
    expect([]).toEqual(findSequenceMatches("atg", " . xt ** ag $#@@!"));
  });
  it("returns matches for non-circular, non-ambiguous, dna searches", function() {
    expect([
      {
        start: 1,
        end: 1
      }
    ]).toEqual(findSequenceMatches("atg", "t"));
    expect([
      {
        start: 2,
        end: 3
      },
      {
        start: 3,
        end: 4
      },
      {
        start: 7,
        end: 8
      }
    ]).toEqual(findSequenceMatches("atgggaagg", "gg"));
    //atgggaagg
    //012345678
  });
  it("returns matches for circular, non-ambiguous, dna searches", function() {
    const matches = findSequenceMatches("atg", "ga", { isCircular: true });
    expect(matches).toEqual([
      {
        start: 2,
        end: 0
      }
    ]);
  });
  it("returns matches for non-circular, non-ambiguous, AA searches", function() {
    expect(findSequenceMatches("atg", "M", { isProteinSearch: true })).toEqual([
      {
        start: 0,
        end: 2
      }
    ]);
    expect(
      findSequenceMatches("TTTATGAGT", "MS", { isProteinSearch: true })
    ).toEqual([
      {
        start: 3,
        end: 8
      }
    ]);
    expect(
      findSequenceMatches("TTATGAGT", "MS", { isProteinSearch: true })
    ).toEqual([
      {
        start: 2,
        end: 7
      }
    ]);
    expect(
      findSequenceMatches("TTTTATGAGT", "MS", { isProteinSearch: true })
    ).toEqual([
      {
        start: 4,
        end: 9
      }
    ]);

    // 0   1   2
    // P   T   R
    // 012 345 678
    // ATG ATG ATG
  });
  it("returns matches for non-circular, ambiguous, dna searches", function() {
    const matches = findSequenceMatches("atg", "m", { isAmbiguous: true });
    expect(matches).toEqual([
      {
        start: 0,
        end: 0
      }
    ]);
    expect(findSequenceMatches("atg", "n", { isAmbiguous: true })).toEqual([
      {
        start: 0,
        end: 0
      },
      {
        start: 1,
        end: 1
      },
      {
        start: 2,
        end: 2
      }
    ]);
    expect(
      findSequenceMatches("atgcctcc", "ccnnc", { isAmbiguous: true })
    ).toEqual([
      {
        start: 3,
        end: 7
      }
    ]);
  });
  it("returns matches for both strands for non-circular, ambiguous, dna searches", function() {
    const matches = findSequenceMatches("atg", "m", {
      isAmbiguous: true,
      searchReverseStrand: true
    });
    expect(matches).toEqual([
      {
        start: 0,
        end: 0
      },
      { bottomStrand: true, end: 2, start: 2 },
      { bottomStrand: true, end: 1, start: 1 }
    ]);
    console.log(
      'findSequenceMatches("atg", "n", { isAmbiguous: true }):',
      findSequenceMatches("atg", "n", { isAmbiguous: true })
    );
    expect(
      findSequenceMatches("atg", "n", {
        isAmbiguous: true,
        searchReverseStrand: true
      })
    ).toEqual([
      { end: 0, start: 0 },
      { end: 1, start: 1 },
      { end: 2, start: 2 },
      { bottomStrand: true, end: 2, start: 2 },
      { bottomStrand: true, end: 1, start: 1 },
      { bottomStrand: true, end: 0, start: 0 }
    ]);
    expect(
      findSequenceMatches("atgcctcc", "ccnnc", { isAmbiguous: true, searchReverseStrand: true })
    ).toEqual([
      {
        start: 3,
        end: 7
      }
    ]);
  });
});
