export default function guessIfSequenceIsDnaAndNotProtein(seq, options={}) {
  const {
    threshold = 0.90, 
    dnaLetters = ['G', 'A', 'T', 'C']
  } = options

  // Guess if the given sequence is DNA or Protein.

  //   It's considered DNA if more than 90% of the sequence is GATCs. The threshold
  //   is configurable via the threshold parameter. dnaLetters can be used to configure
  //   which letters are considered DNA; for instance, adding N might be useful if
  //   you are expecting data with ambiguous bases.
  const dnaLetterMap = dnaLetters.reduce((acc, letter) => {
    acc[letter.toUpperCase()]  = true
    return acc
  }, {})
  let count = 0
  for (let index = 0; index < seq.length; index++) {
    const letter = seq[index];
    if (dnaLetterMap[letter.toUpperCase()]) {
      count = count  +1
    }
  }
  if (count/seq.length > threshold) {
    return true //it is DNA
  }
  return false //it is protein
}
