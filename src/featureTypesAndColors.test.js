const { getFeatureColors } = require("./featureTypesAndColors");

describe("getFeatureColors", function() {
  it("should pass back feature colors by default ", function() {
    expect(getFeatureColors().proprotein).toEqual("#F39A9D");
  });
  it("should allow overwriting of colors ", function() {
    global.tg_extra_feature_type_color_map = {
      proprotein: undefined,
      someRandomFeature: {
        color: "red",
        genbankMapping: "RBS"
      }
    };
    expect(getFeatureColors().proprotein).toEqual(undefined);
    expect(getFeatureColors().someRandomFeature).toEqual("red");
    expect(
      getFeatureColors({ onlyIncludeGenbankCompatible: true }).someRandomFeature
    ).toEqual(undefined);
    expect(
      getFeatureColors({ returnGenbankMapping: true }).someRandomFeature
    ).toEqual("RBS");
  });
});
