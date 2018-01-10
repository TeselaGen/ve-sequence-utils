const tidyUpSequenceData = require("./tidyUpSequenceData");
const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
chai.should();
describe("tidyUpSequenceData", function() {
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

  it("should add new ids to annotations if passed that option", function() {
    const res = tidyUpSequenceData(
      {
        features: [{ start: 4, end: 5, id: 123 }, {}]
      },
      { provideNewIdsForAnnotations: true }
    );
    res.features[0].id.should.not.equal(123)
  });

  it("should add amino acids to a bare translation obj", function() {
    const res = tidyUpSequenceData({
      sequence: "gtagagatagagataga",
      size: 0,
      circular: false,
      features: [],
      parts: [],
      translations: [
        {
          start: 0,
          end: 10
        }
      ],
      cutsites: [],
      orfs: []
    });
    // res.should.containSubset({})
  });
});
