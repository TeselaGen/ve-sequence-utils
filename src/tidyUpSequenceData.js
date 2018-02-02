// tnrtodo: figure out where to insert this validation exactly..
const bsonObjectid = require("bson-objectid");
const getAminoAcidDataForEachBaseOfDna = require("./getAminoAcidDataForEachBaseOfDna");
const { assign } = require("lodash");
const randomColor = require("randomcolor");
const FeatureTypes = require("./FeatureTypes.js");
const areNonNegativeIntegers = require("validate.io-nonnegative-integer-array");
const annotationTypes = require("./annotationTypes");

module.exports = function tidyUpSequenceData(pSeqData, options={}) {
  const {
    annotationsAsObjects,
    provideNewIdsForAnnotations,
    logMessages
  } = options
  let seqData = assign({}, pSeqData); //sequence is usually immutable, so we clone it and return it
  let response = {
    messages: []
  };
  if (!seqData) {
    seqData = {};
  }
  if (!seqData.sequence && seqData.sequence !== "") {
    seqData.sequence = "";
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

  annotationTypes.forEach(function(name) {
    if (!Array.isArray(seqData[name])) {
      if (typeof seqData[name] === "object") {
        seqData[name] = Object.keys(seqData[name]).map(function(key) {
          return seqData[name][key];
        });
      } else {
        seqData[name] = [];
      }
    }
    seqData[name] = seqData[name].filter((annotation) => {
      return cleanUpAnnotation(annotation, options)
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

  function cleanUpAnnotation(annotation, options) {
    if (!annotation || typeof annotation !== "object") {
      response.messages.push("Invalid annotation detected and removed");
      return false;
    }

    annotation.start = parseInt(annotation.start);
    annotation.end = parseInt(annotation.end);

    if (!annotation.name || typeof annotation.name !== "string") {
      response.messages.push(
        'Unable to detect valid name for annotation, setting name to "Untitled annotation"'
      );
      annotation.name = "Untitled annotation";
    }
    if (provideNewIdsForAnnotations) {
      annotation.id = bsonObjectid().str;
    }
    if (!annotation.id && annotation.id !== 0) {
      annotation.id = bsonObjectid().str;
      response.messages.push(
        "Unable to detect valid ID for annotation, setting ID to " +
          annotation.id
      );
    }
    if (
      !areNonNegativeIntegers([annotation.start]) ||
      annotation.start > seqData.size - 1
    ) {
      response.messages.push(
        "Invalid annotation start: " +
          annotation.start +
          " detected for " +
          annotation.name +
          " and set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.start = 0;
    }
    if (
      !areNonNegativeIntegers([annotation.end]) ||
      annotation.end > seqData.size - 1
    ) {
      response.messages.push(
        "Invalid annotation end:  " +
          annotation.end +
          " detected for " +
          annotation.name +
          " and set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.end = 0;
    }
    if (annotation.start > annotation.end && seqData.circular === false) {
      response.messages.push(
        "Invalid circular annotation detected for " +
          annotation.name +
          ". end set to 1"
      ); //setting it to 0 internally, but users will see it as 1
      annotation.end = 0;
    }
    if (!annotation.color) {
      annotation.color = randomColor();
    }

    if (
      annotation.forward === true ||
      annotation.forward === "true" ||
      annotation.strand === 1 ||
      annotation.strand === "1" ||
      annotation.strand === "+"
    ) {
      annotation.forward = true;
      annotation.strand = 1
    } else {
      annotation.forward = false;
      annotation.strand = -1
    }

    if (
      !annotation.type ||
      typeof annotation.type !== "string" ||
      FeatureTypes.some(function(featureType) {
        if (featureType.toLowerCase === annotation.type.toLowerCase()) {
          annotation.type = featureType; //this makes sure the annotation.type is being set to the exact value of the accepted featureType
          return true;
        }
      })
    ) {
      response.messages.push(
        "Invalid annotation type detected:  " +
          annotation.type +
          " for " +
          annotation.name +
          ". set type to misc_feature"
      );
      annotation.type = "misc_feature";
    }
    return true;
  }
};
