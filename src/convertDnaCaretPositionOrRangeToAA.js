const convertDnaRangeToAaRange = require("./convertDnaRangeToAARange");
const convertDnaCaretPositionToAaCaretPosition = require("./convertDnaCaretPositionToAACaretPosition");

module.exports = function convertDnaCaretPositionOrRangeToAA(rangeOrCaret) {
  if (typeof rangeOrCaret === "object" && rangeOrCaret !== null) {
    return convertDnaRangeToAaRange(rangeOrCaret);
  } else {
    return convertDnaCaretPositionToAaCaretPosition(rangeOrCaret);
  }
};
