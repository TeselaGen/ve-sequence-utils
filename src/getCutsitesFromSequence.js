// const ac = require('ve-api-check');
import cutSequenceByRestrictionEnzyme from './cutSequenceByRestrictionEnzyme';

export default function cutsitesFromSequence(
  sequence,
  circular,
  restrictionEnzymes
) {
  //validate args!
  // ac.throw([
  //     ac.string,
  //     ac.bool,
  //     ac.array
  // ], arguments);

  const cutsitesByName = {};
  // const allCutsite= [];
  for (let i = 0; i < restrictionEnzymes.length; i++) {
    const re = restrictionEnzymes[i];
    const cutsites = cutSequenceByRestrictionEnzyme(sequence, circular, re);
    if (cutsites.length) {
      cutsitesByName[re.name] = cutsites;
    }
  }
  return cutsitesByName;
}
