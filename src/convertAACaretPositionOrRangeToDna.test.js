const convertAACaretPositionOrRangeToDna = require("./convertAACaretPositionOrRangeToDna");
describe("convertAACaretPositionOrRangeToDna", function() {
  it(`should convert dna ranges and carets to AA ranges and carets`, () => {
    const res = convertAACaretPositionOrRangeToDna({
      start: 3,
      end: 3
    });
    expect(res.start).toEqual(9);
    expect(res.end).toEqual(11);
    expect(convertAACaretPositionOrRangeToDna(3)).toEqual(9);
  });
});
