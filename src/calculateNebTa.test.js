const assert = require("assert");
const calculateTa = require("./calculateNebTa");

describe("calculate Ta based on Q5 protocol", function() {
  it("should return the annealing temperature of two primers", function() {
    const sequenceSet1 = ["AGCGGATAACAATTTCACACAGGA", "GTAAAACGACGGCCAGT"];
    const options = {
      // 50 mM KCl in Q5 protocol
      monovalentCationConc: 0.05
    };
    // primer concentration in Q5 protocol is 500 nM
    assert.equal(
      calculateTa(sequenceSet1, 0.0000005, options),
      63.54033701264342
    );
    const sequenceSet2 = ["AGCGGATAAGGGCAATTTCAC", "GTAAAACGACGGCCA"];
    assert.equal(
      calculateTa(sequenceSet2, 0.0000005, options),
      59.95638912652805
    );
    const sequenceSet3 = [
      "AGCGGATAAGGGCAATTTCAC",
      "GTAAAACGACGGCCA",
      "AGCGGATAACAATTTCAC"
    ];
    assert.equal(
      calculateTa(sequenceSet3, 0.0000005, options),
      "Error calculating annealing temperature: Error: 3 sequences received when 2 primers were expected"
    );
  });
});
