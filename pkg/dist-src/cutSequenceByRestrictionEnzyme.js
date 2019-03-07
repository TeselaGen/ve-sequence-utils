import { assign } from 'lodash';
import getReverseComplementSequenceString from "./getReverseComplementSequenceString.js";
import { getSequenceWithinRange, normalizePositionByRangeLength, reversePositionInRange } from 've-range-utils';
export default function cutSequenceByRestrictionEnzyme(pSequence, circular, restrictionEnzyme) {
  // ac.throw([
  //     ac.string,
  //     ac.bool,
  //     ac.shape({
  //         "name": ac.string,
  //         "site": ac.string,
  //         "forwardRegex": ac.string,
  //         "reverseRegex": ac.string,
  //         "cutsTwice": ac.number,
  //         "topSnipOffset": ac.number,
  //         "bottomSnipOffset": ac.number
  //     })
  // ], arguments);
  if (restrictionEnzyme.forwardRegex.length === 0 || restrictionEnzyme.reverseRegex.length === 0) {
    let returnArray = [];
    returnArray.error = "Cannot cut sequence. Enzyme restriction site must be at least 1 bp long.";
    return returnArray;
  }

  let forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex, "ig");
  let sequence = pSequence;
  let cutsitesForward = cutSequence(forwardRegExpPattern, restrictionEnzyme, sequence, circular);
  let cutsitesReverse = [];

  if (restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
    let revSequence = getReverseComplementSequenceString(sequence);
    cutsitesReverse = cutSequence(forwardRegExpPattern, restrictionEnzyme, revSequence, circular);
    cutsitesReverse = cutsitesReverse.map(function (cutsite) {
      return reverseAllPositionsOfCutsite(cutsite, sequence.length);
    });
  }

  return cutsitesForward.concat(cutsitesReverse);

  function reverseAllPositionsOfCutsite(cutsite, rangeLength) {
    cutsite.start = reversePositionInRange(cutsite.start, rangeLength, false);
    cutsite.end = reversePositionInRange(cutsite.end, rangeLength, false);
    cutsite.topSnipPosition = reversePositionInRange(cutsite.topSnipPosition, rangeLength, true);
    cutsite.bottomSnipPosition = reversePositionInRange(cutsite.bottomSnipPosition, rangeLength, true);

    if (cutsite.cutsTwice) {
      cutsite.upstreamTopSnip = reversePositionInRange(cutsite.upstreamTopSnip, rangeLength, true);
      cutsite.upstreamBottomSnip = reversePositionInRange(cutsite.upstreamBottomSnip, rangeLength, true);
    }

    cutsite.recognitionSiteRange.start = reversePositionInRange(cutsite.recognitionSiteRange.start, rangeLength, false);
    cutsite.recognitionSiteRange.end = reversePositionInRange(cutsite.recognitionSiteRange.end, rangeLength, false);
    return assign({}, cutsite, {
      start: cutsite.end,
      end: cutsite.start,
      overhangBps: getReverseComplementSequenceString(cutsite.overhangBps),
      topSnipPosition: cutsite.bottomSnipPosition,
      bottomSnipPosition: cutsite.topSnipPosition,
      upstreamTopSnip: cutsite.upstreamBottomSnip,
      upstreamBottomSnip: cutsite.upstreamTopSnip,
      upstreamTopBeforeBottom: !!cutsite.upstreamTopBeforeBottom,
      topSnipBeforeBottom: !!cutsite.topSnipBeforeBottom,
      annotationTypePlural: "cutsites",
      recognitionSiteRange: {
        start: cutsite.recognitionSiteRange.end,
        end: cutsite.recognitionSiteRange.start
      },
      forward: false
    });
  }
}
;

function cutSequence(forwardRegExpPattern, restrictionEnzyme, sequence, circular) {
  let restrictionCutSites = [];
  let restrictionCutSite;
  let recognitionSiteLength = restrictionEnzyme.site.length;
  let originalSequence = sequence;
  let originalSequenceLength = sequence.length;

  if (circular) {
    //if the sequence is circular, we send in double the sequence
    //we'll deduplicate the results afterwards!
    sequence += sequence;
  }

  let currentSequenceLength = sequence.length;
  let matchIndex = sequence.search(forwardRegExpPattern);
  let startIndex = 0;
  let subSequence = sequence;

  while (matchIndex != -1) {
    let recognitionSiteRange = {};
    var start; //start and end should fully enclose the enzyme snips and the recognition site!

    var end;
    let upstreamTopSnip = null; //upstream top snip position

    let upstreamBottomSnip = null; //upstream bottom snip position

    let upstreamTopBeforeBottom = false;
    let topSnipPosition = null; //downstream top snip position

    let bottomSnipPosition = null; //downstream bottom snip position

    let topSnipBeforeBottom = false;
    let fitsWithinSequence = false; // if (matchIndex + startIndex + recognitionSiteLength - 1 >= sequence.length) { // subSequence is too short
    //     break;
    // }

    recognitionSiteRange.start = matchIndex + startIndex;
    start = recognitionSiteRange.start; //this might change later on!

    recognitionSiteRange.end = matchIndex + recognitionSiteLength - 1 + startIndex;
    end = recognitionSiteRange.end; //this might change later on!
    //we need to get the snip sites, top and bottom for each of these cut sites
    //as well as all of the bp's between the snip sites
    //if the cutsite is type 1, it cuts both upstream and downstream of its recognition site (cutsite type 0's cut only downstream)

    if (restrictionEnzyme.cutType == 1) {
      //double cutter, add upstream cutsite here
      upstreamTopSnip = recognitionSiteRange.end - restrictionEnzyme.usForward;
      upstreamBottomSnip = recognitionSiteRange.end - restrictionEnzyme.usReverse;

      if (upstreamTopSnip >= 0 && upstreamBottomSnip >= 0) {
        fitsWithinSequence = true;

        if (upstreamTopSnip < upstreamBottomSnip) {
          if (start > upstreamTopSnip) {
            start = upstreamTopSnip + 1;
          }

          upstreamTopBeforeBottom = true;
        } else {
          if (start > upstreamBottomSnip) {
            start = upstreamBottomSnip + 1;
          }
        }

        upstreamTopSnip = normalizePositionByRangeLength(upstreamTopSnip, originalSequenceLength, true);
        upstreamBottomSnip = normalizePositionByRangeLength(upstreamBottomSnip, originalSequenceLength, true);
      } else {
        upstreamTopSnip = null;
        upstreamBottomSnip = null;
      }
    } //add downstream cutsite here


    topSnipPosition = recognitionSiteRange.start + restrictionEnzyme.topSnipOffset;
    bottomSnipPosition = recognitionSiteRange.start + restrictionEnzyme.bottomSnipOffset;

    if (bottomSnipPosition <= currentSequenceLength && topSnipPosition <= currentSequenceLength) {
      fitsWithinSequence = true;

      if (topSnipPosition > bottomSnipPosition) {
        if (topSnipPosition > recognitionSiteRange.end) {
          end = topSnipPosition - 1;
        }
      } else {
        if (bottomSnipPosition > recognitionSiteRange.end) {
          end = bottomSnipPosition - 1;
        }

        topSnipBeforeBottom = true;
      }

      topSnipPosition = normalizePositionByRangeLength(topSnipPosition, originalSequenceLength, true);
      bottomSnipPosition = normalizePositionByRangeLength(bottomSnipPosition, originalSequenceLength, true);
    } else {
      topSnipPosition = null;
      bottomSnipPosition = null;
    }

    if (fitsWithinSequence && start >= 0 && end >= 0 && start < originalSequenceLength && end < currentSequenceLength) {
      //only push cutsites onto the array if they are fully contained within the boundaries of the sequence!
      //and they aren't duplicated
      start = normalizePositionByRangeLength(start, originalSequenceLength, false);
      end = normalizePositionByRangeLength(end, originalSequenceLength, false);
      recognitionSiteRange.start = normalizePositionByRangeLength(recognitionSiteRange.start, originalSequenceLength, false);
      recognitionSiteRange.end = normalizePositionByRangeLength(recognitionSiteRange.end, originalSequenceLength, false);
      let cutRange = {
        start: -1,
        end: -1
      };

      if (topSnipPosition !== bottomSnipPosition) {
        //there is only a cut range if the snips don't snip at the exact same spot on top and bottom
        cutRange = topSnipBeforeBottom ? {
          start: topSnipPosition,
          end: normalizePositionByRangeLength(bottomSnipPosition - 1, originalSequenceLength)
        } : {
          start: bottomSnipPosition,
          end: normalizePositionByRangeLength(topSnipPosition - 1, originalSequenceLength)
        };
      }

      let overhangBps = getSequenceWithinRange(cutRange, originalSequence);
      restrictionCutSite = {
        start,
        end,
        topSnipPosition,
        bottomSnipPosition,
        topSnipBeforeBottom,
        overhangBps,
        overhangSize: overhangBps.length,
        upstreamTopBeforeBottom,
        upstreamTopSnip,
        upstreamBottomSnip,
        recognitionSiteRange,
        forward: true,
        restrictionEnzyme
      };
      restrictionCutSites.push(restrictionCutSite);
    } // Make sure that we always store the previous match index to ensure
    // that we are always storing indices relative to the whole sequence,
    // not just the subSequence.


    startIndex = startIndex + matchIndex + 1; // Search again on subSequence, starting from the index of the last match + 1.

    subSequence = sequence.substring(startIndex, sequence.length);
    matchIndex = subSequence.search(forwardRegExpPattern);
  }

  return restrictionCutSites;
}