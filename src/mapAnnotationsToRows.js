// const ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
import { each } from 'lodash';

// const areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
import { getYOffsetForPotentiallyCircularRange, splitRangeIntoTwoPartsIfItIsCircular } from 've-range-utils';

export default function mapAnnotationsToRows(
  annotations,
  sequenceLength,
  bpsPerRow
) {
  // ac.throw(ac.arrayOf(ac.shape({
  //     start: ac.posInt,
  //     end: ac.posInt,
  //     // id: ac.oneOfType([ac.object, ac.string])
  // })), annotations);
  // ac.throw(ac.posInt, sequenceLength);
  // ac.throw(ac.posInt, bpsPerRow);

  const annotationsToRowsMap = {};
  const yOffsetLevelMap = {};

  each(annotations, function(annotation) {
    const containsLocations = !!(
      annotation.locations && annotation.locations.length
    );
    mapAnnotationToRows({
      annotation,
      sequenceLength,
      bpsPerRow,
      annotationsToRowsMap,
      yOffsetLevelMap,
      containsLocations
    });
    if (containsLocations) {
      annotation.locations.forEach(location => {
        mapAnnotationToRows({
          annotation,
          sequenceLength,
          bpsPerRow,
          annotationsToRowsMap,
          yOffsetLevelMap,
          location
        });
      });
    }
  });
  return annotationsToRowsMap;
}

function mapAnnotationToRows({
  annotation,
  sequenceLength,
  bpsPerRow,
  annotationsToRowsMap,
  yOffsetLevelMap,
  location,
  containsLocations
}) {
  const ranges = splitRangeIntoTwoPartsIfItIsCircular(
    location || annotation,
    sequenceLength
  );
  ranges.forEach(function(range, index) {
    // if (!isPositiveInteger(range.start)) {}
    const startingRow = Math.floor(range.start / bpsPerRow);
    const endingRow = Math.floor(range.end / bpsPerRow);
    // const numberOfRows = endingRow - startingRow + 1;
    for (let rowNumber = startingRow; rowNumber <= endingRow; rowNumber++) {
      if (!annotationsToRowsMap[rowNumber]) {
        annotationsToRowsMap[rowNumber] = [];
      }
      const annotationsForRow = annotationsToRowsMap[rowNumber];
      if (!yOffsetLevelMap[rowNumber]) {
        yOffsetLevelMap[rowNumber] = [];
      }

      let yOffset;
      const yOffsetsForRow = yOffsetLevelMap[rowNumber];
      const start =
        rowNumber === startingRow ? range.start : rowNumber * bpsPerRow;
      const end =
        rowNumber === endingRow
          ? range.end
          : rowNumber * bpsPerRow + bpsPerRow - 1;

      if (location) {
        //if there's a location then we will just use the previous yOffset for its parent annotation
        annotationsForRow.forEach(ann => {
          if (ann.id === annotation.id) {
            yOffset = ann.yOffset;
          }
        });
      } else {
        //we need to pass both ranges into this function so that we can correctly
        //get the y-offset for circular features that start and end on the same row
        //we pass the entire annotation range here and compare it only with ranges that have already been added to the row
        if (
          index > 0 && //second half of an annotation range
          annotationsForRow.length && //there are already annotations within the row
          annotationsForRow[annotationsForRow.length - 1].annotation ===
            annotation
        ) {
          //the first chunk of the annotation has already been pushed into the row,
          //so set the yOffset for the range chunk to the already calculated yOffset
          yOffset = annotationsForRow[annotationsForRow.length - 1].yOffset;
        } else {
          yOffset = getYOffsetForPotentiallyCircularRange(
            annotation,
            yOffsetsForRow
          );
        }
        //add the new yOffset to the yOffset array
        if (!yOffsetsForRow[yOffset]) yOffsetsForRow[yOffset] = [];
        yOffsetsForRow[yOffset].push({
          start: start,
          end: end
        });
      }

      annotationsForRow.push({
        id: annotation.id,
        annotation: annotation,
        start: start,
        end: end,
        ...(containsLocations && { containsLocations }),
        ...(location && { isJoinedLocation: !!location }),
        yOffset: yOffset,
        enclosingRangeType: range.type //either "beginning", "end" or "beginningAndEnd"
      });
    }
  });
  // return annotationsToRowsMap;
}

//
// function calculateNecessaryYOffsetForAnnotationInRow(annotationsAlreadyAddedToRow, ranges) {
//     const blockedYOffsets = [];
//   //adjust the yOffset of the range being pushed in by checking its range against other ranges already in the row
//     each(annotationsAlreadyAddedToRow, function(comparisonRange) {
//         //check for overlap with other annotations
//         ranges.forEach(function(range){
//             if (checkIfNonCircularRangesOverlap(range, comparisonRange)) {
//                 blockedYOffsets.push(comparisonRange.yOffset);
//                 return true //break the some loop so we only add the blocked offset once
//             }
//         });
//     });

//     const newYOffset = 0;
//   //sort and remove duplicates from the blockedYOffsets array
//   //then starting with newYOffset = 1, see if there is space for the location
//     if (blockedYOffsets.length > 0) {
//         const sortedBlockedYOffsets = sortBy(blockedYOffsets, function(n) {
//             return n;
//         });
//         const sortedUniqueBlockedYOffsets = uniq(sortedBlockedYOffsets, true); //true here specifies that the array has already been sorted
//         const stillPotentiallyBlocked = true;
//         while (stillPotentiallyBlocked) {
//       //sortedUniqueBlockedYOffsets is an array starting with 1 eg. [1,2,4,5,6]
//       //so we loop through it using the index of newYOffset-1, and if there is a gap
//       //in the array, we break the loop and that becomes our final newYOffset
//             if (sortedUniqueBlockedYOffsets[newYOffset] !== newYOffset) {
//         //the newYOffset isn't blocked
//                 stillPotentiallyBlocked = false;
//             } else {
//         //it is blocked
//                 newYOffset++;
//             }
//         }
//     }
//     return newYOffset;
// }
