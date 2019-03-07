import rotateSequenceDataToPosition from './rotateSequenceDataToPosition';
describe("rotateSequenceDataToPosition", function() {
  it("should rotate vanilla sequence data correctly", function() {
    const newData = rotateSequenceDataToPosition(
      {
        //         0123456
        sequence: "atgaccc"
      },
      4
    );
    expect(newData.sequence).toEqual("cccatga");
  });
  it("should rotate sequence data with features correctly", function() {
    const newData = rotateSequenceDataToPosition(
      {
        //         0123456
        sequence: "atgaccc",
        features: [{
          start: 4,
          end: 4
        }, {
          start: 1,
          end: 0
        }]
      },
      4
    );
    expect(newData.sequence).toEqual("cccatga");
    expect(newData.features).toMatchObject([
      {
        start: 0,
        end: 0
      },
      {
        start: 4,
        end: 3
      },

    ]);
  });
});
