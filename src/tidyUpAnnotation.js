const { cloneDeep } = require("lodash");
const FeatureTypes = require("./FeatureTypes.js");
const featureColors = require("./featureColors");
const areNonNegativeIntegers = require("validate.io-nonnegative-integer-array");
const bsonObjectid = require("bson-objectid");

module.exports = function tidyUpAnnotation(
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
  const { size, circular, isProtein } = sequenceData;
  if (!_annotation || typeof _annotation !== "object") {
    messages.push("Invalid annotation detected and removed");
    return false;
  }
  let annotation = _annotation;
  if (!mutative) {
    annotation = cloneDeep(_annotation);
  }
  annotation.annotationTypePlural = annotationType;

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

  //run this for the annotation itself
  coerceLocation({
    isProtein,
    location: annotation,
    convertAnnotationsFromAAIndices,
    size,
    messages,
    circular,
    name: annotation.name
  });
  //and for each location
  annotation.locations &&
    annotation.locations.forEach(location => {
      coerceLocation({
        isProtein,
        location,
        convertAnnotationsFromAAIndices,
        size,
        messages,
        circular,
        name: annotation.name
      });
    });

  if (
    isProtein ||
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

function coerceLocation({
  location,
  convertAnnotationsFromAAIndices,
  size,
  isProtein,
  messages,
  circular,
  name
}) {
  location.start = parseInt(location.start, 10);
  location.end = parseInt(location.end, 10);

  if (convertAnnotationsFromAAIndices) {
    location.start = location.start * 3;
    location.end = location.end * 3 + 2;
  }
  if (!areNonNegativeIntegers([location.start]) || location.start > size - 1) {
    messages.push(
      "Invalid annotation start: " +
        location.start +
        " detected for " +
        location.name +
        " and set to size: " +
        size
    ); //setting it to 0 internally, but users will see it as 1
    location.start = size - (isProtein ? 3 : 1);
  }
  if (!areNonNegativeIntegers([location.end]) || location.end > size - 1) {
    messages.push(
      "Invalid annotation end:  " +
        location.end +
        " detected for " +
        location.name +
        " and set to seq size: " +
        size
    ); //setting it to 0 internally, but users will see it as 1
    location.end = size - 1;
  }
  if (location.start > location.end && circular === false) {
    messages.push(
      "Invalid circular annotation detected for " + name + ". end set to 1"
    ); //setting it to 0 internally, but users will see it as 1
    location.end = size;
  }
}
