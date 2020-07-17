const tidyUpSequenceData = require("./tidyUpSequenceData");
const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
chai.should();
describe("tidyUpSequenceData", function() {
  it("should remove unwanted chars if passed that option, while handling annotation start,end (and location start,end) truncation correctly", function() {
    const res = tidyUpSequenceData(
      {
        sequence: "http://localhost:3344/Standalone",
        features: [
          {
            start: 3,
            end: 20,
            locations: [
              {
                start: 3,
                end: 5
              },
              {
                start: 10,
                end: 20
              }
            ]
          }
        ]
      },
      { removeUnwantedChars: true }
    );
    res.should.containSubset({
      sequence: "httcahstStandan",
      circular: false,
      features: [
        {
          start: 3,
          end: 14,
          locations: [
            {
              start: 3,
              end: 5
            },
            {
              start: 10,
              end: 14
            }
          ]
        }
      ]
    });
  });
  // const res = tidyUpSequenceData(
  //   {
  //     isProtein: true,
  //     circular: true,
  //     proteinSequence: "gagiuhwgagalasjglj*.",
  //     features: [{ start: 3, end: 10 }, { start: 10, end: 20 }]
  //   },
  //   { convertAnnotationsFromAAIndices: true, removeUnwantedChars: true }
  // );

  it("should handle a protein sequence being passed in with isProtein set to true", function() {
    const res = tidyUpSequenceData(
      {
        isProtein: true,
        circular: true,
        proteinSequence: "gagiuhwgagalasjglj*.",
        features: [
          { start: 3, end: 10, forward: false },
          { start: 10, end: 20 },
          { name: "iDon'tFit", start: 25, end: 35 }
        ]
      },
      { convertAnnotationsFromAAIndices: true, removeUnwantedChars: true }
    );
    res.should.containSubset({
      aminoAcidDataForEachBaseOfDNA: [
        {
          aminoAcid: {
            value: ".",
            name: "Stop",
            threeLettersName: "Stop",
            color: "#FF0000"
          },
          positionInCodon: 0,
          aminoAcidIndex: 17,
          sequenceIndex: 51,
          codonRange: {
            start: 51,
            end: 53
          },
          fullCodon: true
        },
        {
          aminoAcid: {
            value: ".",
            name: "Stop",
            threeLettersName: "Stop",
            color: "#FF0000"
          },
          positionInCodon: 1,
          aminoAcidIndex: 17,
          sequenceIndex: 52,
          codonRange: {
            start: 51,
            end: 53
          },
          fullCodon: true
        },
        {
          aminoAcid: {
            value: ".",
            name: "Stop",
            threeLettersName: "Stop",
            color: "#FF0000"
          },
          positionInCodon: 2,
          aminoAcidIndex: 17,
          sequenceIndex: 53,
          codonRange: {
            start: 51,
            end: 53
          },
          fullCodon: true
        }
      ],
      isProtein: true,
      size: 54, //size should refer to the DNA length
      proteinSize: 18, //proteinSize should refer to the amino acid length
      sequence: "ggngcnggnauhugacayuggggngcnggngcnyungcnwsnggnyuntrrtrr", //degenerate sequence
      proteinSequence: "gagiuhwgagalasgl*.",
      circular: false,
      features: [
        { start: 9, end: 32, forward: true },
        { start: 30, end: 53, forward: true },
        {
          name: "iDon'tFit",
          start: 51,
          end: 53,
          forward: true
        }
      ]
    });
  });
  it("should handle the noSequence option correctly and not truncate .size", function() {
    const res = tidyUpSequenceData({
      noSequence: true,
      size: 20
    });
    res.should.containSubset({
      noSequence: true,
      sequence: "",
      size: 20,
      circular: false,
      features: [],
      parts: [],
      translations: [],
      cutsites: [],
      orfs: []
    });
  });
  it("should add default fields to an empty sequence obj", function() {
    const res = tidyUpSequenceData({});
    res.should.containSubset({
      sequence: "",
      size: 0,
      circular: false,
      features: [],
      parts: [],
      translations: [],
      cutsites: [],
      orfs: []
    });
  });

  it("should add default fields to an empty sequence obj, and handle annotationsAsObjects=true", function() {
    const res = tidyUpSequenceData({}, { annotationsAsObjects: true });
    res.should.containSubset({
      sequence: "",
      size: 0,
      circular: false,
      features: {},
      parts: {},
      translations: {},
      cutsites: {},
      orfs: {}
    });
  });

  it("should add ids to annotations", function() {
    const res = tidyUpSequenceData(
      {
        features: [{ start: 4, end: 5 }, {}]
      },
      { annotationsAsObjects: true }
    );
    Object.keys(res.features).should.be.length(2);
  });

  it("should add feature type = misc_feature if no type is provided", function() {
    const res = tidyUpSequenceData({
      features: [{ start: 4, end: 5 }]
    });
    res.features[0].type.should.equal("misc_feature");
  });
  // it("should normalize strange upper/lower casing in feature types", function() {
  //   const res = tidyUpSequenceData(
  //     {
  //       features: [{ start: 4, end: 5, type: "cDs" }]
  //     },
  //   );
  //   res.features[0].type.should.equal("CDS")
  // });
  it("should not clobber existing feature types", function() {
    const res = tidyUpSequenceData({
      features: [{ start: 4, end: 5, type: "CDS" }]
    });
    res.features[0].type.should.equal("CDS");
  });

  it("should add correct color based on type for existing features colors", function() {
    const res = tidyUpSequenceData({
      features: [{ start: 4, end: 5, type: "CDS" }]
    });
    res.features[0].color.should.equal("#EF6500");
  });

  it("should not clobber existing feature colors", function() {
    const res = tidyUpSequenceData({
      features: [{ start: 4, end: 5, color: "#f4f4f4" }]
    });
    res.features[0].color.should.equal("#f4f4f4");
  });

  it("should add new ids to annotations if passed that option", function() {
    const res = tidyUpSequenceData(
      {
        features: [{ start: 4, end: 5, id: 123 }, {}]
      },
      { provideNewIdsForAnnotations: true }
    );
    res.features[0].id.should.not.equal(123);
  });
  it("should add the annotationTypePlural field", function() {
    const res = tidyUpSequenceData(
      {
        features: [{ start: 4, end: 5, id: 123 }, {}]
      },
      { provideNewIdsForAnnotations: true }
    );
    res.features[0].id.should.not.equal(123);
    res.features[0].annotationTypePlural.should.equal("features");
  });

  // it("should add amino acids to a bare translation obj", function() {
  //   const res = tidyUpSequenceData({
  //     sequence: "gtagagatagagataga",
  //     size: 0,
  //     circular: false,
  //     features: [],
  //     parts: [],
  //     translations: [
  //       {
  //         start: 0,
  //         end: 10
  //       }
  //     ],
  //     cutsites: [],
  //     orfs: []
  //   });
  //   // res.should.containSubset({})
  // });
});
