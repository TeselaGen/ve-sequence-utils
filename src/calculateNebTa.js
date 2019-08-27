const calculateTm = require("./calculateNebTm");

module.exports = function calculateNebTa(
  sequences,
  primerConc,
  { monovalentCationConc } = {}
) {
  try {
    if (sequences.length !== 2) {
      throw new Error(
        `${sequences.length} sequences received when 2 primers were expected`
      );
    }
    const meltingTemperatures = sequences.map(seq =>
      calculateTm(seq, primerConc, { monovalentCationConc })
    );
    meltingTemperatures.sort((a, b) => a - b);
    const lowerMeltingTemp = meltingTemperatures[0];
    // annealing temperature as lower melting temperature of the two primers + 1 degC is standard for Q5 protocol
    const annealingTemp = lowerMeltingTemp + 1;
    return annealingTemp;
  } catch (err) {
    return `Error calculating annealing temperature: ${err}`;
  }
};
