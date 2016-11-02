module.exports = function calculatePercentGC(bps) {
    return (bps.match(/[cg]/g) || []).length/bps.length * 100 || 0
}
