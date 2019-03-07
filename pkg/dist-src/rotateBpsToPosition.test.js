import rotateBpsToPosition from "./rotateBpsToPosition.js";
describe('rotateBpsToPosition', function () {
  it('should rotate Bps To Position correctly ', function () {
    expect(rotateBpsToPosition("atgaccc", 4)).toEqual("cccatga");
  });
});