//tnr: half finished test.
// const tap = require('tap');
// tap.mochaGlobals();
const chai = require("chai");
chai.should();
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const getSequenceDataBetweenRange = require("./getSequenceDataBetweenRange");

describe("getSequenceDataBetweenRange", function() {
  it("should return an empty sequence if given an invalid range", function() {
    const res = getSequenceDataBetweenRange(
      {
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
      features: [],
      parts: []
    });
  });
  it("non circular feature, non circular range", function() {
    const res = getSequenceDataBetweenRange(
      {
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
