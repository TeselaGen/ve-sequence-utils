import { flatMap, extend } from 'lodash';
import { getRangeLength } from 've-range-utils';
import convertDnaCaretPositionOrRangeToAa from './convertDnaCaretPositionOrRangeToAA';
import { getSequenceWithinRange, getZeroedRangeOverlaps } from 've-range-utils';
import tidyUpSequenceData from './tidyUpSequenceData';
import annotationTypes from './annotationTypes';

export default function getSequenceDataBetweenRange(
  seqData,
  range,
  options = {}
) {
  if (!range) return seqData;
  const { exclude = {}, excludePartial = {} } = options;
  const seqDataToUse = tidyUpSequenceData(seqData);
  let seqDataToReturn = extend(
    {},
    seqDataToUse,
    {
      sequence: getSequenceWithinRange(range, seqDataToUse.sequence),
      proteinSequence: getSequenceWithinRange(
        convertDnaCaretPositionOrRangeToAa(range),
        seqDataToUse.proteinSequence
      )
    },
    annotationTypes.reduce((acc, type) => {
      if (exclude[type]) {
        acc[type] = [];
        return acc; //return early cause we're not interested in these annotations
      }
      acc[type] = getAnnotationsBetweenRange(
        seqDataToUse[type],
        range,
        seqDataToUse.sequence.length,
        excludePartial[type]
      );
      return acc;
    }, {})
  );
  return tidyUpSequenceData(seqDataToReturn);
}

function getAnnotationsBetweenRange(
  annotationsToBeAdjusted,
  range,
  maxLength,
  shouldExcludePartial
) {
  return flatMap(annotationsToBeAdjusted, function(annotation) {
    //map through every annotation and get the overlap of the annotation with the range
    const overlaps = getZeroedRangeOverlaps(annotation, range, maxLength).map(
      overlap => {
        //we get back 1 or more overlaps here

        return extend({}, annotation, overlap);
      }
    );
    if (shouldExcludePartial) {
      if (overlaps.length > 1) return []; //the annotation has multiple overlaps and thus must be a partial copy so we exclude it completely
      if (overlaps[0]) {
        //there is just 1 overlap, if it doesn't have the same length, it must be a partial copy so we need to exclude it
        if (
          getRangeLength(overlaps[0], maxLength) !==
          getRangeLength(annotation, maxLength)
        ) {
          return [];
        }
      }
    }
    return overlaps;
  }); //filter any fully deleted ranges
}
