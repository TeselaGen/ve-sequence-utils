module.exports = {
  A: {
    value: "A",
    name: "Alanine",
    threeLettersName: "Ala",
    hydrophobicity: 1.8,
    colorByFamily: "#00FFFF",
    color: "#FF5C5C"
  },
  R: {
    value: "R",
    name: "Arginine",
    threeLettersName: "Arg",
    hydrophobicity: -4.5,
    colorByFamily: "#FFC0CB",
    color: "#190000"
  },
  N: {
    value: "N",
    name: "Asparagine",
    threeLettersName: "Asn",
    hydrophobicity: -3.5,
    colorByFamily: "#D3D3D3",
    color: "#4D0000"
  },
  D: {
    value: "D",
    name: "Aspartic acid",
    threeLettersName: "Asp",
    hydrophobicity: -3.5,
    colorByFamily: "#EE82EE",
    color: "#4D0000"
  },
  C: {
    value: "C",
    name: "Cysteine",
    threeLettersName: "Cys",
    hydrophobicity: 2.5,
    colorByFamily: "#FFFF00",
    color: "#FF8080"
  },
  E: {
    value: "E",
    name: "Glutamic acid",
    threeLettersName: "Glu",
    hydrophobicity: -3.5,
    colorByFamily: "#EE82EE",
    color: "#4D0000"
  },
  Q: {
    value: "Q",
    name: "Glutamine",
    threeLettersName: "Gln",
    hydrophobicity: -3.5,
    colorByFamily: "#D3D3D3",
    color: "#4D0000"
  },
  G: {
    value: "G",
    name: "Glycine",
    threeLettersName: "Gly",
    hydrophobicity: -0.4,
    colorByFamily: "#00FFFF",
    color: "#EB0000"
  },
  H: {
    value: "H",
    name: "Histidine",
    threeLettersName: "His",
    hydrophobicity: -3.2,
    colorByFamily: "#FFC0CB",
    color: "#5C0000"
  },
  I: {
    value: "I",
    name: "Isoleucine ",
    threeLettersName: "Ile",
    hydrophobicity: 4.5,
    colorByFamily: "#00FFFF",
    color: "#FFE6E6"
  },
  L: {
    value: "L",
    name: "Leucine",
    threeLettersName: "Leu",
    hydrophobicity: 3.8,
    colorByFamily: "#00FFFF",
    color: "#FFC2C2"
  },
  K: {
    value: "K",
    name: "Lysine",
    threeLettersName: "Lys",
    hydrophobicity: -3.9,
    colorByFamily: "#FFC0CB",
    color: "#380000"
  },
  M: {
    value: "M",
    name: "Methionine",
    threeLettersName: "Met",
    hydrophobicity: 1.9,
    colorByFamily: "#FFFF00",
    color: "#FF6161"
  },
  F: {
    value: "F",
    name: "Phenylalanine",
    threeLettersName: "Phe",
    hydrophobicity: 2.8,
    colorByFamily: "#FFA500",
    color: "#FF8F8F"
  },
  P: {
    value: "P",
    name: "Proline",
    threeLettersName: "Pro",
    hydrophobicity: -1.6,
    colorByFamily: "#00FFFF",
    color: "#AD0000"
  },
  S: {
    value: "S",
    name: "Serine",
    threeLettersName: "Ser",
    hydrophobicity: -0.8,
    colorByFamily: "#90EE90",
    color: "#D60000"
  },
  T: {
    value: "T",
    name: "Threonine",
    threeLettersName: "Thr",
    hydrophobicity: -0.7,
    colorByFamily: "#90EE90",
    color: "#DB0000"
  },
  U: {
    value: "U",
    name: "Selenocysteine",
    threeLettersName: "Sec",
    colorByFamily: "#FF0000",
    color: "#FF0000"
  },
  W: {
    value: "W",
    name: "Tryptophan",
    threeLettersName: "Trp",
    hydrophobicity: -0.9,
    colorByFamily: "#FFA500",
    color: "#D10000"
  },
  Y: {
    value: "Y",
    name: "Tyrosine",
    threeLettersName: "Tyr",
    hydrophobicity: -1.3,
    colorByFamily: "#FFA500",
    color: "#BD0000"
  },
  V: {
    value: "V",
    name: "Valine",
    threeLettersName: "Val",
    hydrophobicity: 4.2,
    colorByFamily: "#00FFFF",
    color: "#FFD6D6"
  },
  "*": {
    value: "*",
    name: "Stop",
    threeLettersName: "Stop",
    colorByFamily: "#FF0000",
    color: "#FF0000"
  },
  ".": {
    //tnr: this is actually a deletion/gap character (previously we had this as a stop character which is incorrect) https://www.dnabaser.com/articles/IUPAC%20ambiguity%20codes.html
    value: ".",
    name: "Gap",
    threeLettersName: "Stop",
    colorByFamily: "#FF0000",
    color: "#FF0000"
  },
  "-": {
    value: "-",
    name: "Gap",
    threeLettersName: "Gap",
    colorByFamily: "#FF0000",
    color: "#FF0000"
  },
  B: {
    value: "B",
    threeLettersName: "ND",
    colorByFamily: "lightpurple",
    color: "lightpurple",
    isAmbiguous: true,
    name: "B",
    aliases: "ND"
  },
  J: {
    value: "J",
    threeLettersName: "IL",
    colorByFamily: "lightpurple",
    color: "lightpurple",
    isAmbiguous: true,
    name: "J",
    aliases: "IL"
  },
  X: {
    value: "X",
    threeLettersName: "ACDEFGHIKLMNPQRSTVWY",
    colorByFamily: "#FFFFFF",
    color: "lightpurple",
    isAmbiguous: true,
    name: "X",
    aliases: "ACDEFGHIKLMNPQRSTVWY"
  },
  Z: {
    value: "Z",
    threeLettersName: "QE",
    colorByFamily: "lightpurple",
    color: "lightpurple",
    isAmbiguous: true,
    name: "Z",
    aliases: "QE"
  }
};
