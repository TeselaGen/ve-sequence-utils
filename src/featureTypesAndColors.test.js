const {
  getFeatureToColorMap,
  getMergedFeatureMap,
  getGenbankFeatureToColorMap
} = require("./featureTypesAndColors");

describe("getFeatureToColorMap", function() {
  it("should pass back feature colors by default ", function() {
    expect(getFeatureToColorMap().proprotein).toEqual("#F39A9D");
  });

  it("should allow overwriting of colors ", function() {
    global.tg_featureTypeOverrides = [
      { name: "proprotein", isHidden: true },
      { name: "someRandomFeature", color: "red", genbankEquivalentType: "RBS" }
    ];
    expect(getFeatureToColorMap().proprotein).toEqual(undefined);
    expect(getFeatureToColorMap().someRandomFeature).toEqual("red");
    expect(getGenbankFeatureToColorMap().someRandomFeature).toEqual(undefined);
  });
});
describe("getMergedFeatureMap", function() {
  it("should maintain the genbankEquivalentType", function() {
    global.tg_featureTypeOverrides = [
      { name: "proprotein", isHidden: true },
      { name: "someRandomFeature", color: "red", genbankEquivalentType: "RBS" }
    ];
    expect(
      getMergedFeatureMap().someRandomFeature.genbankEquivalentType
    ).toEqual("RBS");
  });
});
