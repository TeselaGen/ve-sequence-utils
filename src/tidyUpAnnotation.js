const { cloneDeep } = require("lodash");
const FeatureTypes = require("./FeatureTypes.js");
const featureColors = require("./featureColors");
const areNonNegativeIntegers = require("validate.io-nonnegative-integer-array");
const bsonObjectid = require("bson-objectid");

module.exports = function cleanUpAnnotation(
  _annotation,
  {
    sequenceData = {},
    convertAnnotationsFromAAIndices,
    annotationType,
    provideNewIdsForAnnotations,
    messages = [],
    mutative
  }
) {
  const { size, circular } = sequenceData;
  if (!_annotation || typeof _annotation !== "object") {
    messages.push("Invalid annotation detected and removed");
    return false;
  }
  let annotation = _annotation;
  if (!mutative) {
    annotation = cloneDeep(_annotation);
  }
  annotation.annotationTypePlural = annotationType;

  annotation.start = parseInt(annotation.start, 10);
  annotation.end = parseInt(annotation.end, 10);
  if (convertAnnotationsFromAAIndices) {
    annotation.start = annotation.start * 3;
    annotation.end = annotation.end * 3 + 2;
  }
  if (!annotation.name || typeof annotation.name !== "string") {
    messages.push(
      'Unable to detect valid name for annotation, setting name to "Untitled annotation"'
    );
    annotation.name = "Untitled annotation";
  }
  if (provideNewIdsForAnnotations) {
    annotation.id = bsonObjectid().str;
  }
  if (!annotation.id && annotation.id !== 0) {
    annotation.id = bsonObjectid().str;
    messages.push(
      "Unable to detect valid ID for annotation, setting ID to " + annotation.id
    );
  }
  if (
    !areNonNegativeIntegers([annotation.start]) ||
    annotation.start > size - 1
  ) {
    messages.push(
      "Invalid annotation start: " +
        annotation.start +
        " detected for " +
        annotation.name +
        " and set to size: " +
        size
    ); //setting it to 0 internally, but users will see it as 1
    annotation.start = size - 1;
  }
  if (!areNonNegativeIntegers([annotation.end]) || annotation.end > size - 1) {
    messages.push(
      "Invalid annotation end:  " +
        annotation.end +
        " detected for " +
        annotation.name +
        " and set to seq size: " +
        size
    ); //setting it to 0 internally, but users will see it as 1
    annotation.end = size - 1;
  }
  if (annotation.start > annotation.end && circular === false) {
    messages.push(
      "Invalid circular annotation detected for " +
        annotation.name +
        ". end set to 1"
    ); //setting it to 0 internally, but users will see it as 1
    annotation.end = size;
  }

  if (
    annotation.forward === true ||
    annotation.forward === "true" ||
    annotation.strand === 1 ||
    annotation.strand === "1" ||
    annotation.strand === "+"
  ) {
    annotation.forward = true;
    annotation.strand = 1;
  } else {
    annotation.forward = false;
    annotation.strand = -1;
  }

  if (
    !annotation.type ||
    typeof annotation.type !== "string" ||
    FeatureTypes.some(function(featureType) {
      if (featureType.toLowerCase === annotation.type.toLowerCase()) {
        annotation.type = featureType; //this makes sure the annotation.type is being set to the exact value of the accepted featureType
        return true;
      }
      return false;
    })
  ) {
    messages.push(
      "Invalid annotation type detected:  " +
        annotation.type +
        " for " +
        annotation.name +
        ". set type to misc_feature"
    );
    annotation.type = "misc_feature";
  }

  if (!annotation.color) {
    annotation.color = featureColors[annotation.type];
  }
  return annotation;
};
