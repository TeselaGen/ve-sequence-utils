module.exports = function convertDnaRangeToAARange(range) {
  return {
    ...range,
    start: range.start > -1 ? Math.floor(range.start / 3) : range.start,
    end: range.end > -1 ? Math.floor(range.end - 2) / 3 : range.end
  };
};
