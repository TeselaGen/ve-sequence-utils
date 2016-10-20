var norm1based = require('ve-range-utils/normalizePositionByRangeLength1Based');
module.exports = function getInsertBetweenVals(caretPosition, selectionLayer, sequenceLength) {
  if (selectionLayer.start > -1) {
    //selection layer
    return [norm1based(selectionLayer.start,sequenceLength), norm1based(selectionLayer.end+2, sequenceLength)]
  } else if (caretPosition > -1) {
    return [norm1based(caretPosition, sequenceLength), norm1based(caretPosition+1, sequenceLength)]
  } else {
    return [sequenceLength, 1]
  }
}
