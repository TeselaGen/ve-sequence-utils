//UNDER CONSTRUCTION
const getVirtualDigest = require("./getVirtualDigest");
describe("getVirtualDigest", function() {
  // it('should be further developed', function() {

  // })
  it("should return the correct fragments given a set of cutsites and allowPartialDigests=true", function() {
    const { fragments } = getVirtualDigest({
      cutsites: [{ topSnipPosition: 10 }, { topSnipPosition: 20 }],
      sequenceLength: 100,
      isCircular: true,
      allowPartialDigests: true
    });
    expect(fragments).toMatchObject([
      {
        cut1: { topSnipPosition: 10 },
        cut2: { topSnipPosition: 10 },
        start: 10,
        end: 9,
        size: 100,
        id: "10-9-100-"
      },
      {
        cut1: { topSnipPosition: 10 },
        cut2: { topSnipPosition: 20 },
        start: 10,
        end: 19,
        size: 10,
        id: "10-19-10-"
      },
      {
        cut1: { topSnipPosition: 20 },
        cut2: { topSnipPosition: 10 },
        start: 20,
        end: 9,
        size: 90,
        id: "20-9-90-"
      },
      {
        cut1: { topSnipPosition: 20 },
        cut2: { topSnipPosition: 20 },
        start: 20,
        end: 19,
        size: 100,
        id: "20-19-100-"
      }
    ]);
  });
  it("should return the correct fragments given a set of cutsites", function() {
    const { fragments } = getVirtualDigest({
      cutsites: [{ topSnipPosition: 10 }, { topSnipPosition: 20 }],
      sequenceLength: 100,
      isCircular: true,
      allowPartialDigests: false
    });
    expect(fragments).toMatchObject([
      {
        cut1: { topSnipPosition: 10 },
        cut2: { topSnipPosition: 20 },
        start: 10,
        end: 19,
        size: 10,
        id: "10-19-10-"
      },
      {
        cut1: { topSnipPosition: 20 },
        cut2: { topSnipPosition: 10 },
        start: 20,
        end: 9,
        size: 90,
        id: "20-9-90-"
      }
    ]);
  });
  it("should return the correct fragments given a set of cutsites and a linear sequence", function() {
    const { fragments } = getVirtualDigest({
      cutsites: [{ topSnipPosition: 10 }, { topSnipPosition: 20 }],
      sequenceLength: 100,
      isCircular: false,
      allowPartialDigests: false
    });
    expect(fragments).toMatchObject([
      {
        cut1: {
          topSnipPosition: 10
        },
        cut2: {
          topSnipPosition: 20
        },
        start: 10,
        end: 19,
        size: 10,
        id: "10-19-10-"
      },
      {
        start: 20,
        end: 99,
        cut1: {
          topSnipPosition: 20
        },
        cut2: "endOfSeq",
        size: 80,
        id: "20-99-80-"
      },
      {
        start: 0,
        end: 9,
        cut1: "startOfSeq",
        cut2: {
          topSnipPosition: 10
        },
        size: 10,
        id: "0-9-10-"
      }
    ]);
  });
});
