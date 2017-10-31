var _require = require('ve-range-utils'),
    splitRangeIntoTwoPartsIfItIsCircular = _require.splitRangeIntoTwoPartsIfItIsCircular,
    getSequenceWithinRange = _require.getSequenceWithinRange,
    invertRange = _require.invertRange,
    isPositionWithinRange = _require.isPositionWithinRange;

var spliceString = require('string-splice');

module.exports = function adjustBpsToReplaceOrInsert(bpString) {
    var insertString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var caretPositionOrRange = arguments[2];

    var stringToReturn = bpString;

    if (caretPositionOrRange && caretPositionOrRange.start > -1) {
        // invertRange()
        // getSequenceWithinRange()
        var ranges = splitRangeIntoTwoPartsIfItIsCircular(invertRange(caretPositionOrRange, bpString.length));
        stringToReturn = "";
        ranges.forEach(function (range, index) {
            stringToReturn += getSequenceWithinRange(range, bpString);
            if (ranges.length === 1) {
                console.log('range:', range);
                if (isPositionWithinRange(0, range, bpString.length, true, true)) {
                    console.log('yyyy');
                    stringToReturn = stringToReturn + insertString;
                } else {
                    stringToReturn = insertString + stringToReturn;
                }
            } else {
                if (index === 0) stringToReturn += insertString;
            }
        });
    } else {
        //caretPosition Passed
        stringToReturn = spliceString(bpString, caretPositionOrRange, 0, insertString);
    }
    return stringToReturn;
};