// tnrtodo: figure out where to insert this validation exactly..
const bsonObjectid = require("bson-objectid");
const getAminoAcidDataForEachBaseOfDna = require("./getAminoAcidDataForEachBaseOfDna");
const { cloneDeep } = require("lodash");
const areNonNegativeIntegers = require("validate.io-nonnegative-integer-array");
const annotationTypes = require("./annotationTypes");
const filterSequenceString = require("./filterSequenceString");
const tidyUpAnnotation = require("./tidyUpAnnotation");
const filterAminoAcidSequenceString = require("./filterAminoAcidSequenceString");
const getDegenerateDnaStringFromAaString = require("./getDegenerateDnaStringFromAAString");

module.exports = function tidyUpSequenceData(pSeqData, options = {}) {
  const {
    annotationsAsObjects,
    logMessages,
    removeUnwantedChars,
    additionalValidChars,
    noTranslationData,
    charOverrides,
    proteinFilterOptions,
    convertAnnotationsFromAAIndices
  } = options;
  let seqData = cloneDeep(pSeqData); //sequence is usually immutable, so we clone it and return it
  let response = {
    messages: []
  };
  if (!seqData) {
    seqData = {};
  }
  if (!seqData.sequence) {
    seqData.sequence = "";
  }
  if (!seqData.proteinSequence) {
    seqData.proteinSequence = "";
  }
  let needsBackTranslation = false;
  if (seqData.isProtein) {
    seqData.circular = false; //there are no circular proteins..
    if (!seqData.proteinSequence && seqData.proteinSequence !== "") {
      seqData.proteinSequence = seqData.sequence; //if there is no proteinSequence, assign seqData.sequence
    }
    if (
      !seqData.sequence ||
      seqData.sequence.length !== seqData.proteinSequence.length * 3
    ) {
      //if we don't have a sequence or it is clear that the DNA sequence doesn't match the proteinSequence, add a back translation
      needsBackTranslation = true;
    }
  }
  if (removeUnwantedChars) {
    if (seqData.isProtein) {
      seqData.proteinSequence = filterAminoAcidSequenceString(
        seqData.proteinSequence,
        { includeStopCodon: true, ...proteinFilterOptions }
      );
    } else {
      seqData.sequence = filterSequenceString(
        seqData.sequence,
        additionalValidChars,
        charOverrides
      );
    }
  }
  if (seqData.isProtein) {
    if (needsBackTranslation) {
      //backtranslate the AA sequence
      seqData.sequence = getDegenerateDnaStringFromAaString(
        seqData.proteinSequence
      );
    }
    seqData.aminoAcidDataForEachBaseOfDNA = getAminoAcidDataForEachBaseOfDna(
      seqData.proteinSequence,
      true,
      null,
      true
    );
  }

  seqData.size = seqData.noSequence ? seqData.size : seqData.sequence.length;
  seqData.proteinSize = seqData.noSequence
    ? seqData.proteinSize
    : seqData.proteinSequence.length;
  if (
    seqData.circular === "false" ||
    /* eslint-disable eqeqeq*/

    seqData.circular == -1 ||
    /* eslint-enable eqeqeq*/

    !seqData.circular
  ) {
    seqData.circular = false;
  } else {
    seqData.circular = true;
  }

  annotationTypes.forEach(function(annotationType) {
    if (!Array.isArray(seqData[annotationType])) {
      if (typeof seqData[annotationType] === "object") {
        seqData[annotationType] = Object.keys(seqData[annotationType]).map(
          function(key) {
            return seqData[annotationType][key];
          }
        );
      } else {
        seqData[annotationType] = [];
      }
    }
    seqData[annotationType] = seqData[annotationType].filter(annotation => {
      return tidyUpAnnotation(annotation, {
        ...options,
        sequenceData: seqData,
        convertAnnotationsFromAAIndices,
        mutative: true,
        annotationType
      });
    });
  });

  if (!noTranslationData) {
    seqData.translations = seqData.translations.map(function(translation) {
      if (!translation.aminoAcids && !seqData.noSequence) {
        translation.aminoAcids = getAminoAcidDataForEachBaseOfDna(
          seqData.sequence,
          translation.forward,
          translation
        );
      }
      return translation;
    });
  }

  if (annotationsAsObjects) {
    annotationTypes.forEach(function(name) {
      seqData[name] = seqData[name].reduce(function(acc, item) {
        let itemId;
        if (areNonNegativeIntegers(item.id) || item.id) {
          itemId = item.id;
        } else {
          itemId = bsonObjectid().str;
          item.id = itemId; //assign the newly created id to the item d
        }
        acc[itemId] = item;
        return acc;
      }, {});
    });
  }
  if (logMessages && response.messages.length > 0) {
    console.info("tidyUpSequenceData messages:", response.messages);
  }
  return seqData;
};
