const map = require('lodash/map');
const {adjustRangeToInsert, adjustRangeToDeletionOfAnotherRange} = require('ve-range-utils');
const tidyUpSequenceData = require('./tidyUpSequenceData');
const modifiableTypes = require('./annotationTypes').modifiableTypes;
const adjustBpsToReplaceOrInsert = require('./adjustBpsToReplaceOrInsert');

module.exports = function insertSequenceDataAtPositionOrRange(_sequenceDataToInsert, _existingSequenceData, caretPositionOrRange) {
    const existingSequenceData = tidyUpSequenceData(_existingSequenceData)
    const sequenceDataToInsert = tidyUpSequenceData(_sequenceDataToInsert);
    let newSequenceData = tidyUpSequenceData({}); //makes a new blank sequence
    const insertLength = sequenceDataToInsert.sequence.length;
    let caretPosition = caretPositionOrRange

    //update the sequence
    newSequenceData.sequence = adjustBpsToReplaceOrInsert(existingSequenceData.sequence, sequenceDataToInsert.sequence, caretPositionOrRange)
    
    //update the annotations: 
    //handle the delete if necessary
    if (caretPositionOrRange && caretPositionOrRange.start > -1) {
        //we have a range! so let's delete it!
        const range = caretPositionOrRange
        caretPosition = range.start
        //update all annotations for the deletion
        modifiableTypes.forEach((annotationType)=>{
            newSequenceData[annotationType] = newSequenceData[annotationType].concat(adjustAnnotationsToDelete(existingSequenceData[annotationType], range, existingSequenceData.sequence.length));
        })
    }
    //handle the insert
    modifiableTypes.forEach((annotationType)=>{
        newSequenceData[annotationType] = newSequenceData[annotationType].concat(adjustAnnotationsToInsert(existingSequenceData[annotationType], caretPosition, insertLength));
        newSequenceData[annotationType] = newSequenceData[annotationType].concat(adjustAnnotationsToInsert(sequenceDataToInsert[annotationType], 0, caretPosition));
    })
    return newSequenceData;
}

function adjustAnnotationsToInsert(annotationsToBeAdjusted, insertStart, insertLength) {
    return map(annotationsToBeAdjusted, function(annotation) {
        return adjustRangeToInsert(annotation, insertStart, insertLength);
    });
}
function adjustAnnotationsToDelete(annotationsToBeAdjusted, range, maxLength) {
    return map(annotationsToBeAdjusted, function(annotation) {
        return adjustRangeToDeletionOfAnotherRange(annotation, range, maxLength);
    }).filter((range) => !!range) //filter any fully deleted ranges
}
