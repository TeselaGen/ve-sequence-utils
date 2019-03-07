import getDigestFragmentsForCutsites from "./getDigestFragmentsForCutsites.js";
import cutSequenceByRestrictionEnzyme from "./cutSequenceByRestrictionEnzyme.js";
import { flatMap } from 'lodash';
export default function getDigestFragmentsForRestrictionEnzymes(sequence, circular, restrictionEnzymeOrEnzymes) {
  const restrictionEnzymes = Array.isArray(restrictionEnzymeOrEnzymes) ? restrictionEnzymeOrEnzymes : [restrictionEnzymeOrEnzymes];
  const cutsites = flatMap(restrictionEnzymes, restrictionEnzyme => {
    return cutSequenceByRestrictionEnzyme(sequence, circular, restrictionEnzyme);
  });
  return getDigestFragmentsForCutsites(sequence.length, circular, cutsites);
}
;