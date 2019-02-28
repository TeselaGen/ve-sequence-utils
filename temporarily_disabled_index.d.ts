
// export type tidyUpSequenceData = (options: WithTableParamsOptions) => void;



interface sequenceDataObj {
  /**
   * the DNA sequence string
   */
  sequence: string;
  /**
   * the AA sequence string
   */
  protein: string;
  /**
   * the DNA size
   */
  size: integer;
  /**
   * the DNA size
   */
  proteinSize: integer;
  features: [featureObj]
}

interface featureObj extends annotationObj {
  color: string;
}


interface annotationObj {
  /**
   * 0-based inclusive indexed DNA position
   */
  start: integer;
  /**
   * 0-based inclusive indexed DNA position
   */
  end: integer;
}


/**
 * Withs table params
 * @param options
 * @example
 * tidyUpSequenceData(sequenceData)
 */
export function tidyUpSequenceData(
  sequenceData: sequenceDataObj;
  options: tidyUpSequenceDataOptions;
): string;

interface tidyUpSequenceDataOptions {
   
  /**
   * whether to return the annotations as arrays (default) or objects
   */
  annotationsAsObjects: boolean; 
  logMessages: string;
  /**
   * filter the sequence string 
   */
  removeUnwantedChars: string;
  /**
   * convert from AA indexed {start,end} to a DNA bp indexed {start,end}
   */
  convertAnnotationsFromAAIndices: boolean;
  additionalValidChars: string;
  charOverrides: string;
  proteinFilterOptions: object;

}


// enzymeList
// featureColors
// DNAComplementMap
// FeatureTypes


// getDigestFragmentsForCutsites 
// getDigestFragmentsForRestrictionEnzymes
// addGapsToSeqReads
// getInsertBetweenVals
// adjustBpsToReplaceOrInsert
// getLeftAndRightOfSequenceInRangeGivenPosition
// annotationTypes
// bioData
// getOrfsFromSequence
// calculatePercentGC
// getOverlapBetweenTwoSequences
// calculateTm
// getPossiblePartsFromSequenceAndEnzymes
// condensePairwiseAlignmentDifferences
// getReverseAminoAcidStringFromSequenceString
// convertDnaCaretPositionOrRangeToAA
// getReverseComplementAminoAcidStringFromSequenceString
// convertDnaCaretPositionToAACaretPosition
// getReverseComplementAnnotation
// convertDnaRangeToAARange
// cutSequenceByRestrictionEnzyme
// getReverseComplementSequenceAndAnnotations
// deleteSequenceDataAtRange
// getReverseComplementSequenceString
// getSequenceDataBetweenRange
// doesEnzymeChopOutsideOfRecognitionSite
// getVirtualDigest
// guessIfSequenceIsDnaAndNotProtein
// filterAminoAcidSequenceString
// filterSequenceString
// insertGapsIntoRefSeq
// findNearestRangeOfSequenceOverlapToPosition
// insertSequenceDataAtPosition
// findOrfsInPlasmid
// insertSequenceDataAtPositionOrRange
// findSequenceMatches
// mapAnnotationsToRows
// generateSequenceData
// prepareCircularViewData
// getAllInsertionsInSeqReads
// prepareRowData
// getAminoAcidDataForEachBaseOfDna
// prepareRowData_output1
// getAminoAcidFromSequenceTriplet
// proteinAlphabet
// getAminoAcidStringFromSequenceString
// rotateBpsToPosition
// getCodonRangeForAASliver
// rotateSequenceDataToPosition
// getComplementAminoAcidStringFromSequenceString
// getComplementSequenceAndAnnotations
// threeLetterSequenceStringToAminoAcidMap
// getComplementSequenceString
// tidyUpAnnotation
// getCutsiteType
// tidyUpSequenceData
// getCutsitesFromSequence
// getDegenerateDnaStringFromAAString


// /*~ If this module has methods, declare them as functions like so.
//  */
// interface WithUpsertOptions {
//   /**
//    * @property {string} mutationName - optional rename of the default upsert function withXXXX to whatever you want
//    *
//    */
//   mutationName: string;
//   /**
//    * @property {[queryNameStrings]} refetchQueries -
//    *
//    */
//   refetchQueries: [queryNameStrings];
//   /**
//    * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
//    *
//    */
//   showError: boolean;
//   /**
//    * @property {obj | function} extraMutateArgs - obj or function that
//    * returns obj to get passed to the actual mutation call
//    *
//    */
//   extraMutateArgs: obj | function;
//   /**
//    * @property {[string]} invalidate - array of model types to invalidate after the mutate
//    *
//    */
//   invalidate: [string];
//   /**
//    * @property {boolean} asFunction - if true, this gives you back a function you can call directly instead of a HOC
//    *
//    */
//   asFunction: boolean;
//   /**
//    * @property {string} idAs - if not using a fragment, you get an id
//    * field back as default. But, if the record doesn't have an id field,
//    * and instead has a 'code', you can set idAs: 'code'
//    *
//    */
//   idAs: string;
//   /**
//    *  * @property {boolean} forceCreate - sometimes the thing you're creating
//    *  won't have an id field (it might have a code or something else as its primary key).
//    * This lets you override the default behavior of updating if no id is found
//    *
//    */
//   forceCreate: boolean;
//   /**
//    *  * @property {boolean} forceUpdate - sometimes the thing you're updating might have
//    * an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
//    *
//    */
//   forceUpdate: boolean;
//   /**
//    *  * @property {boolean} excludeResults - don't fetch back result entities after update or create
//    */
//   excludeResults: boolean;
// }



// /**
//  * Note all these options can be passed at Design Time or at Runtime (like reduxForm())
//  */
// interface WithTableParamsOptions {
//   /**
//    * @property {*string} formName - required unique identifier for the table
//    */
//   formName: string;
//   /**
//    * @property The data table schema or a function returning it. The function wll be called with props as the argument.
//    */
//   schema: Object | Function;
//   /**
//    * @property whether the table should connect to/update the URL
//    */
//   urlConnected: boolean;
//   /**
//    * @property whether or not to pass the selected entities
//    */
//   withSelectedEntities: boolean;
//   /**
//    * @property whether the model is keyed by code instead of id in the db
//    */
//   isCodeModel: boolean;
//   /**
//    * @property tableParam defaults such as pageSize, filter, etc
//    */
//   defaults: object;
//   /**
//    * @property won't console an error if an order is not found on schema
//    */
//   noOrderError: boolean;
// }

// /**
//  * Withs table params
//  * @param options
//  * @example
//  * withTableParams({formName: "mySequenceTable"})
//  */
// export type withTableParams = (options: WithTableParamsOptions) => void;

// interface ToastrFunc {
//   /**
//    * Fire a little toastr notification
//    *
//    * @example
//    *    // they all work similarly
//    *
//    *    window.toastr.warning("Error")
//    *    you can also chain them using a unique key
//    *    window.toastr.info("Sequence Saving", {key: "seqSave"})
//    *    window.toastr.success("Sequence Saved!", {key: "seqSave"})
//    */
//   (message: string, options: ToastrFuncOptions): void;
// }

// interface ToastrFuncOptions {
//   /**
//    * defaults to false, set this only if you're also using a key option and you want to
//    * have the timeout be refreshed
//    */
//   updateTimeout: boolean;
//   /**
//    * use a unique key to update the toastr
//    */
//   key: string;
// }

// declare global {
//   interface Window {
//     toastr: {
//       success: ToastrFunc;
//       error: ToastrFunc;
//       warning: ToastrFunc;
//       info: ToastrFunc;
//       default: ToastrFunc;
//     };
//   }
// }

// // export function myOtherMethod(a: number): number;

// // /*~ You can declare types that are available via importing the module */
// // export interface SomeType {
// //   name: string;
// //   length: number;
// //   extras?: string[];
// // }

// // /*~ You can declare properties of the module using const, let, or var */
// // export const myField: number;

// // /*~ If there are types, properties, or methods inside dotted names
// //  *~ of the module, declare them inside a 'namespace'.
// //  */
// // export namespace subProp {
// //   /*~ For example, given this definition, someone could write:
// //      *~   import { subProp } from 'yourModule';
// //      *~   subProp.foo();
// //      *~ or
// //      *~   import * as yourMod from 'yourModule';
// import { withTableParams } from "./index";
// //      *~   yourMod.subProp.foo();
// //      */
// //   export function foo(): void;
// // }
