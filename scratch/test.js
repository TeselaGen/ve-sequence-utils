const { uniq, filter } = require("lodash");
const aliasedEnzymes = require("./aliasedEnzymes.json");
const enzymesKeyedByName = {};
aliasedEnzymes.forEach((enz) => {
  enz.name.forEach((name) => {
    enzymesKeyedByName[name.toLowerCase()] = enz;
  });
});

const defaultEnzymes = [
  "aatii",
  "acci",
  "accii",
  "acciii",
  "afai",
  "aflii",
  "alui",
  "aor13hi",
  "aor51hi",
  "apai",
  "apali",
  "asci",
  "asisi",
  "avrii",
  "bali",
  "bamhi",
  "banii",
  "bcni",
  "bgli",
  "bglii",
  "blni",
  "bmet110i",
  "bmgt120i",
  "bpu1102i",
  "bsai",
  "bsgi",
  "bsmbi",
  "bsp1286i",
  "bsp1407i",
  "bspt104i",
  "bspt107i",
  "bsshii",
  "bst1107i",
  "bstpi",
  "bstxi",
  "cfr10i",
  "clai",
  "cpoi",
  "ddei",
  "dpni",
  "drai",
  "eaei",
  "eagi",
  "eam1105i",
  "eco52i",
  "eco81i",
  "ecoo109i",
  "ecoo65i",
  "ecori",
  "ecorv",
  "ecot14i",
  "ecot22i",
  "fbai",
  "foki",
  "fsei",
  "haeii",
  "haeiii",
  "hapii",
  "hhai",
  "hin1i",
  "hincii",
  "hindiii",
  "hinfi",
  "hpai",
  "kpni",
  "mboi",
  "mboii",
  "mfli",
  "mlui",
  "msei",
  "mspi",
  "muni",
  "naei",
  "ncoi",
  "ndei",
  "nhei",
  "noti",
  "nrui",
  "nsbi",
  "paci",
  "pmaci",
  "pmei",
  "pshai",
  "pshbi",
  "psp1406i",
  "psti",
  "pvui",
  "pvuii",
  "saci",
  "sacii",
  "sali",
  "sapi",
  "sau3ai",
  "sbfi",
  "scai",
  "sfii",
  "smai",
  "smii",
  "snabi",
  "spei",
  "sphi",
  "srfi",
  "sse8387i",
  "sspi",
  "stui",
  "swai",
  "taqi",
  "tth111i",
  "van91i",
  "vpak11bi",
  "xbai",
  "xhoi",
  "xmai",
  "xspi",
];

const defaultEnzymesByHash = {}
const defaultEnzymesFull = [];
defaultEnzymes.forEach((name, index) => {
  const fullEnz = enzymesKeyedByName[name]
  fullEnz["canonicalName" + index] = name
  const hash = getEnzymeHash(fullEnz)
  const existing =  defaultEnzymesByHash[hash]  || []
  defaultEnzymesByHash[hash] = [fullEnz].concat(existing);

  defaultEnzymesFull.push(fullEnz);
});

// console.log(`defaultEnzymesFull.length:`, defaultEnzymesFull.length);
// console.log(
//   `uniq(defaultEnzymesFull).length:`,
//   uniq(defaultEnzymesFull).length
// );
const dups = filter(defaultEnzymesByHash, (z) => z.length > 1)
console.log(`dups.length:`,dups.length)
console.log(`dups:`,dups)


function getEnzymeHash(z) {
  return `${z.site}-${z.topSnipOffset}-${z.bottomSnipOffset}-${z.cutType}-${z.usForward}-${z.usReverse}`;
}
