import { splitRangeIntoTwoPartsIfItIsCircular, getSequenceWithinRange, invertRange, isPositionWithinRange } from 've-range-utils';
import spliceString from 'string-splice';

export default function adjustBpsToReplaceOrInsert(
  bpString,
  insertString = "",
  caretPositionOrRange,
  isProtein
) {
  let stringToReturn = bpString;

  if (caretPositionOrRange && caretPositionOrRange.start > -1) {
    // invertRange()
    // getSequenceWithinRange()
    const ranges = splitRangeIntoTwoPartsIfItIsCircular(
      invertRange(caretPositionOrRange, bpString.length)
    );
    stringToReturn = "";
    ranges.forEach((range, index) => {
      stringToReturn += getSequenceWithinRange(range, bpString);
      if (ranges.length === 1) {
        if (isPositionWithinRange(0, range, bpString.length, true, true)) {
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
    stringToReturn = spliceString(
      bpString,
      caretPositionOrRange,
      0,
      insertString
    );
  }
  return stringToReturn;
}
