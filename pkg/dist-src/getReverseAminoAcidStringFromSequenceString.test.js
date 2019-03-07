import getReverseAminoAcidStringFromSequenceString from "./getReverseAminoAcidStringFromSequenceString.js";
import assert from 'assert';
describe("getReverseAminoAcidStringFromSequenceString", function () {
  it("computes a aa string from dna", function () {
    assert.equal("M", getReverseAminoAcidStringFromSequenceString("cat"));
    assert.equal("H", getReverseAminoAcidStringFromSequenceString("atg"));
    assert.equal("HH", getReverseAminoAcidStringFromSequenceString("atgatg"));
    assert.equal("", getReverseAminoAcidStringFromSequenceString("at"));
  });
});