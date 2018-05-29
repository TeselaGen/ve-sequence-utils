// tnrtodo: figure out where to insert this validation exactly..
const bsonObjectid = require("bson-objectid");
const getAminoAcidDataForEachBaseOfDna = require("./getAminoAcidDataForEachBaseOfDna");
const { cloneDeep } = require("lodash");
const areNonNegativeIntegers = require("validate.io-nonnegative-integer-array");
const annotationTypes = require("./annotationTypes");
const filterSequenceString = require("./filterSequenceString");
const tidyUpAnnotation = require("./tidyUpAnnotation");

module.exports = function tidyUpSequenceData(pSeqData, options = {}) {
  const {
    annotationsAsObjects,
    logMessages,
    removeUnwantedChars,
    additionalValidChars,
    charOverrides
  } = options;
  let seqData = cloneDeep(pSeqData); //sequence is usually immutable, so we clone it and return it
  let response = {
    messages: []
  };
  if (!seqData) {
    seqData = {};
  }
  if (!seqData.sequence && seqData.sequence !== "") {
    seqData.sequence = "";
  }
  if (removeUnwantedChars) {
    seqData.sequence = filterSequenceString(
      seqData.sequence,
      additionalValidChars,
      charOverrides
    );
  }
  seqData.size = seqData.sequence.length;
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
        seqData[annotationType] = Object.keys(
          seqData[annotationType]
        ).map(function(key) {
          return seqData[annotationType][key];
        });
      } else {
        seqData[annotationType] = [];
      }
    }
    seqData[annotationType] = seqData[annotationType].filter(annotation => {
      return tidyUpAnnotation(annotation, { ...options, seqData, annotationType });
    });
  });

  seqData.translations = seqData.translations.map(function(translation) {
    if (!translation.aminoAcids) {
      translation.aminoAcids = getAminoAcidDataForEachBaseOfDna(
        seqData.sequence,
        translation.forward,
        translation
      );
    }
    return translation;
  });

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
    console.log("tidyUpSequenceData messages:", response.messages);
  }
  return seqData;
};
