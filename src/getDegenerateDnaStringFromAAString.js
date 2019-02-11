const AminoAcidToDegenerateDnaMap = {
  t: "acn",
  g: "ggn",
  a: "gcn",
  l: "yun",
  m: "aug",
  f: "uuy",
  w: "ugg",
  k: "aar",
  q: "car",
  e: "gar",
  s: "wsn",
  p: "ccn",
  v: "gun",
  i: "auh",
  c: "ugy",
  y: "uay",
  h: "cay",
  r: "mng",
  n: "aay",
  d: "gay",
  u: "uga",
  "*": "trr",
  ".": "trr"
};

module.exports = function getDegenerateDnaStringFromAAString(aaString) {
  return aaString
    .split("")
    .map(char => AminoAcidToDegenerateDnaMap[char.toLowerCase()] || "xxx")
    .join("");
};
