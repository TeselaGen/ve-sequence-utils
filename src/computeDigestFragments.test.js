const {
  getDigestFragsForSeqAndEnzymes
} = require("./computeDigestFragments.js");
const aliasedEnzymesByName = require("./aliasedEnzymesByName");

describe("computeDigestFragments", function() {
  it.only("it should correctly generate fragments for bamhi cutting once in a circular sequence", function() {
    const result = getDigestFragsForSeqAndEnzymes({
      sequence: "ggggatccggggggggggggggggggggggggggggggggggggggggg",
      circular: true,
      enzymes: [aliasedEnzymesByName.bamhi]
    });
    expect(result.fragments).toHaveLength(1);
    expect(result.fragments[0].start).toEqual(3);
    expect(result.fragments[0].end).toEqual(2);
    expect(result.fragments[0].size).toEqual(49);
    expect(result.fragments[0].madeFromOneCutsite).toEqual(true);
  });
  it("it should correctly generate fragments for bamhi cutting once in a linear sequence", function() {
    const result = getDigestFragsForSeqAndEnzymes({
      sequence: "ggggatccggggggggggggggggggggggggggggggggggggggggg",
      circular: false,
      enzymes: [aliasedEnzymesByName.bamhi]
    });
    expect(result.fragments).toHaveLength(2);
    expect(result.fragments[0].isFormedFromLinearEnd).toEqual(true);
    expect(result.fragments[0].name).toEqual(
      "BamHI -- Linear_Sequence_End 46 bps"
    );
    expect(result.fragments[0].start).toEqual(3);
    expect(result.fragments[0].end).toEqual(48);
    expect(result.fragments[0].size).toEqual(46);
    expect(result.fragments[0].madeFromOneCutsite).toEqual(false);

    expect(result.fragments[1].isFormedFromLinearEnd).toEqual(true);
    expect(result.fragments[1].name).toEqual(
      "Linear_Sequence_Start -- BamHI 3 bps"
    );
    expect(result.fragments[1].start).toEqual(0);
    expect(result.fragments[1].end).toEqual(2);
    expect(result.fragments[1].size).toEqual(3);
    expect(result.fragments[1].madeFromOneCutsite).toEqual(false);
  });
});
