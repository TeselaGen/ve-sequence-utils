//tnr: half finished test.
// const tap = require('tap');
// tap.mochaGlobals();
const chai = require("chai");
chai.should();
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const getSequenceDataBetweenRange = require("./getSequenceDataBetweenRange");

describe("getSequenceDataBetweenRange", function() {
  it("should handle range.overlapsSelf flag", function() {
    const res = getSequenceDataBetweenRange(
      {
        circular: true,
        //         0123456789012
        //         ffffffff gg
        sequence: "tttggggaaaccc",
        //          ttg
        parts: [
          {
            start: 1,
            end: 3,
            name: "iOverlapMyself",
            overlapsSelf: true
          }
        ],
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          },
          {
            start: 9,
            end: 10,
            name: "grumpy"
          }
        ]
      },
      {
        start: 1,
        end: 3,
        overlapsSelf: true
      }
    );
    res.parts[0].overlapsSelf.should.equal(false); //if the range perfectly overlaps the selfOverlapped annotation, the annotation should no longer be wrapping
    res.should.containSubset({
      sequence: "ttggggaaaccctttg",
      parts: [
        {
          start: 0,
          end: 15,
          name: "iOverlapMyself"
        }
      ],
      features: [
        {
          start: 0,
          end: 6,
          name: "happy"
        },
        {
          start: 12,
          end: 15,
          name: "happy"
        },
        {
          start: 8,
          end: 9,
          name: "grumpy"
        }
      ]
    });
  });

  it("should set circular to false if a sub range is selected of a circular sequence", function() {
    const res = getSequenceDataBetweenRange(
      {
        circular: true,
        sequence: "atgcatgc"
      },
      {
        start: 1,
        end: 5
      }
    );
    res.should.containSubset({
      circular: false
    });
  });
  it("should maintain circularity if the full entire sequence is selected from a circular sequence", function() {
    const res = getSequenceDataBetweenRange(
      {
        circular: true,
        sequence: "atgcatgc"
      },
      {
        start: 3,
        end: 2
      }
    );
    res.should.containSubset({
      circular: true
    });
  });
  it("should maintain circular=false if the full entire sequence is selected from a linear sequence", function() {
    const res = getSequenceDataBetweenRange(
      {
        circular: false,
        sequence: "atgcatgc"
      },
      {
        start: 3,
        end: 2
      }
    );
    res.should.containSubset({
      circular: false
    });
  });
  it("should return an empty sequence if given an invalid range", function() {
    const res = getSequenceDataBetweenRange(
      {
        isProtein: true,
        sequence: "atgcatgc",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ]
      },
      {
        start: -1,
        end: -1
      }
    );
    res.should.containSubset({
      sequence: "",
      isProtein: true,
      proteinSequence: "",
      features: [],
      parts: []
    });
  });
  it("protein sequence non circular feature, non circular range", function() {
    const res = getSequenceDataBetweenRange(
      {
        sequence: "atgcatgcatgc",
        proteinSequence: "MHAC",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ]
      },
      {
        start: 3,
        end: 8
      }
    );
    res.should.containSubset({
      sequence: "catgca",
      proteinSequence: "HA",
      features: [
        {
          start: 0,
          end: 4,
          name: "happy"
        }
      ]
    });
  });
  it("non circular feature, non circular range", function() {
    const res = getSequenceDataBetweenRange(
      {
        sequence: "atgcatgca",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ]
      },
      {
        start: 2,
        end: 3
      }
    );
    res.should.containSubset({
      sequence: "gc",
      features: [
        {
          start: 0,
          end: 1,
          name: "happy"
        }
      ]
    });
  });
  it("feature with locations, non circular range", function() {
    const res = getSequenceDataBetweenRange(
      {
        sequence: "atgcatgca",
        features: [
          {
            start: 0,
            end: 7,
            locations: [
              { start: 0, end: 1 },
              { start: 2, end: 5 },
              { start: 6, end: 7 }
            ],
            name: "happy"
          }
        ]
      },
      {
        start: 2,
        end: 3
      }
    );
    res.should.containSubset({
      sequence: "gc",
      features: [
        {
          start: 0,
          end: 1,
          locations: [
            {
              start: 0,
              end: 1
            }
          ],
          name: "happy"
        }
      ]
    });
  });
  it("feature with locations, non circular enclosing range", function() {
    const res = getSequenceDataBetweenRange(
      {
        sequence: "gggatgcatgca",
        //         012345678901
        //              ffffff
        //              ll  ll
        //            ccccccccc
        //            012345678
        features: [
          {
            start: 5,
            end: 10,
            locations: [
              { start: 5, end: 6 },
              { start: 9, end: 10 }
            ],
            name: "happy"
          }
        ]
      },
      {
        start: 3,
        end: 11
      }
    );
    res.should.containSubset({
      sequence: "atgcatgca",
      features: [
        {
          start: 2,
          end: 7,
          locations: [
            { start: 2, end: 3 },
            { start: 6, end: 7 }
          ],
          name: "happy"
        }
      ]
    });
  });
  it.only("feature with locations, non circular, non-fully enclosing range - it should trim the start/end correctly to match the location", function() {
    const res = getSequenceDataBetweenRange(
      {
        sequence: "gggatgcatgca",
        //         012345678901
        //              ffffff
        //              ll  ll
        //                sssss
        //                01234
        features: [
          {
            start: 5,
            end: 10,
            locations: [
              { start: 5, end: 6 },
              { start: 9, end: 10 }
            ],
            name: "happy"
          }
        ]
      },
      {
        start: 7,
        end: 11
      }
    );

    res.should.containSubset({
      sequence: "atgca",
      features: [
        {
          start: 2,
          end: 3,
          name: "happy",
          locations: undefined
        }
      ]
    });
  });
  it("non circular feature, circular range", function() {
    const res = getSequenceDataBetweenRange(
      {
        //ssss sss
        //01234567
        sequence: "atgcatgc",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ],
        parts: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ]
      },
      {
        start: 5,
        end: 3
      }
    );
    res.should.containSubset({
      sequence: "tgcatgc",
      features: [
        {
          start: 0,
          end: 2,
          name: "happy"
        },
        {
          start: 3,
          end: 6,
          name: "happy"
        }
      ],
      parts: [
        {
          start: 0,
          end: 2,
          name: "happy"
        },
        {
          start: 3,
          end: 6,
          name: "happy"
        }
      ]
    });
  });
  it("non circular feature, circular range, with partial parts excluded", function() {
    const res = getSequenceDataBetweenRange(
      {
        //ssss sss
        //01234567
        sequence: "atgcatgc",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ],
        parts: {
          "2asf23": {
            start: 0,
            id: "2asf23",
            end: 7,
            name: "happy"
          }
        }
      },
      {
        start: 5,
        end: 3
      },
      {
        excludePartial: {
          parts: true
        }
      }
    );
    res.should.containSubset({
      sequence: "tgcatgc",
      features: [
        {
          start: 0,
          end: 2,
          name: "happy"
        },
        {
          start: 3,
          end: 6,
          name: "happy"
        }
      ],
      parts: []
    });
  });
  it("non circular feature, circular range, with features excluded", function() {
    const res = getSequenceDataBetweenRange(
      {
        //ssss sss
        //01234567
        sequence: "atgcatgc",
        features: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ],
        parts: [
          {
            start: 0,
            end: 7,
            name: "happy"
          }
        ]
      },
      {
        start: 5,
        end: 3
      },
      { exclude: { features: true } }
    );
    res.features.length.should.equal(0);
    res.should.containSubset({
      sequence: "tgcatgc",
      features: [],
      parts: [
        {
          start: 0,
          end: 2,
          name: "happy"
        },
        {
          start: 3,
          end: 6,
          name: "happy"
        }
      ]
    });
  });
});
