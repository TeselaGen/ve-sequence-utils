"use strict";

var _require = require("ve-range-utils"),
    normalizePositionByRangeLength1Based = _require.normalizePositionByRangeLength1Based;

module.exports = function getInsertBetweenVals(caretPosition, selectionLayer, sequenceLength) {
  if (selectionLayer.start > -1) {
    //selection layer
    return [normalizePositionByRangeLength1Based(selectionLayer.start, sequenceLength), normalizePositionByRangeLength1Based(selectionLayer.end + 2, sequenceLength)];
  } else if (caretPosition > -1) {
    return [normalizePositionByRangeLength1Based(caretPosition, sequenceLength), normalizePositionByRangeLength1Based(caretPosition + 1, sequenceLength)];
  } else {
    return [sequenceLength, 1];
  }
};