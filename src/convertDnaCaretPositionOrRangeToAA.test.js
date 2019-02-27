const convertDnaCaretPositionOrRangeToAa = require("./convertDnaCaretPositionOrRangeToAA");
describe("convertDnaCaretPositionOrRangeToAa", function() {
  it(`should convert dna ranges and carets to AA ranges and carets`, () => {
    const res = convertDnaCaretPositionOrRangeToAa({
      start: 9,
      end: 11
    });
    expect(res.start).toEqual(3);
    expect(res.end).toEqual(3);
    //  0 1 2 3 4
    //   0 1 2 3
    //   a t g c
    expect(convertDnaCaretPositionOrRangeToAa(3)).toEqual(1);
  });
});
