/**
 * This function get the range of overlap of one sequence to another based on sequence equality.
 * 
 * @param  {[type]} sequenceToSearchIn [description]
 * @param  {[type]} sequenceToFind     [description]
 * @param  {[type]} options            [description]
 * @return {[type]}                    [description]
 */
var modulatePositionByRange = require('ve-range-utils/modulatePositionByRange')

module.exports = function getOverlapBetweenTwoSequences (sequenceToFind, sequenceToSearchIn, options) {
    options = options || {}
    var lengthenedSeqToSearch = sequenceToSearchIn + sequenceToSearchIn
    var index = lengthenedSeqToSearch.indexOf(sequenceToFind)
    if (index > -1) {
      return {
        start: index,
        end: modulatePositionByRange(index + sequenceToFind.length - 1, {start: 0,end: sequenceToSearchIn.length -1})
      }
    } else {
      return null
    }
};
