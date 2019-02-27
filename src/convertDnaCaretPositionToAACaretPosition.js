module.exports = function convertDnaCaretPositionToAACaretPosition(caret) {
  return Math.floor(caret / 3);
};
