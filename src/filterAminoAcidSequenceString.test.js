import assert from 'assert';
import filterAminoAcidSequenceString from './filterAminoAcidSequenceString';
describe("filterAminoAcidSequenceString", function() {
  it("should filter only valid amino acids by default", function() {
    let filteredString = filterAminoAcidSequenceString(
      'bbb342"""xtgalmfwkqespvicyhrnd,,../'
    );
    assert.equal(filteredString, "xtgalmfwkqespvicyhrnd");
  });
  it("should handle upper case letters", function() {
    let filteredString = filterAminoAcidSequenceString("xtgalmfWKQEspvicyhrnd");
    assert.equal(filteredString, "xtgalmfWKQEspvicyhrnd");
  });
  it("should handle the option to includeStopCodon by allowing periods", function() {
    let options = { includeStopCodon: true };
    let filteredString = filterAminoAcidSequenceString(
      'bbb342"""xtgalmfwkqespvicyhrnd,,../',
      options
    );
    assert.equal(filteredString, "xtgalmfwkqespvicyhrnd..");
  });
});
