'use strict';

// var ac = require('ve-api-check');
module.exports = function filterAminoAcidSequenceString(sequenceString, options) {
    options = options || {};
    if (options.includeStopCodon) {
        return sequenceString.replace(/[^xtgalmfwkqespvicyhrnd\.]/ig, '');
    }
    // ac.throw(ac.string, sequenceString);
    return sequenceString.replace(/[^xtgalmfwkqespvicyhrnd]/ig, '');
};