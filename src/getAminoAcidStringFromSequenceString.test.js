var getAminoAcidStringFromSequenceString = require("./getAminoAcidStringFromSequenceString");
var assert = require("assert");

describe("getAminoAcidStringFromSequenceString", function() {
  it("computes a aa string from dna", function() {
    assert.equal("M", getAminoAcidStringFromSequenceString("atg"));
    assert.equal("MM", getAminoAcidStringFromSequenceString("atgatg"));
    assert.equal("", getAminoAcidStringFromSequenceString("at"));
  });
});
