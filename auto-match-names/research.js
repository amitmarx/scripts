const translate = require("translate");
const baseline = require("./baseline.json");
const hammingDistance = require("hamming");
const FuzzyMatching = require("fuzzy-matching");

function getWordLanguage(word) {
  const isHeb = (i) => i <= "ת" && i >= "א";
  const isEng = (i) => (i <= "z" && i >= "a") || (i <= "Z" && i >= "A");
  const balance = word.split("").reduce(
    (balance, letter) => (balance += !isHeb(letter) && isEng(letter) ? 1 : -1),
    0
  );
  return balance >= 0 ? "en" : "he";
}

function getArrayLanguage(samples) {
  const balance = samples.reduce(
    (balance, word) => (balance += getLanguage(word) === "en" ? 1 : -1),
    0
  );
  return balance >= 0 ? "en" : "he";
}

function getLanguage(i) {
  if (typeof i === "string") return getWordLanguage(i);
  return getArrayLanguage(i);
}

async function main() {
  // translate.engine = "deepl";
  // translate.key = process.env.DEEPL_KEY;

  const translateIfNeeded = async (w) =>
    getLanguage(w) === "he" ? w : translate(w, "he");

  const transalted = await Promise.all(
    baseline.map(async ({ sample, expected }) => {
      return {
        sample,
        expected,
        sampleInHeb: await translateIfNeeded(sample),
        expectedInHeb: await translateIfNeeded(expected),
      };
    })
  );

  const allOptions = transalted.map((x) => x.expectedInHeb);
  const fm = new FuzzyMatching(allOptions);

  const result = transalted.map((t) => {
    const bestMatch = fm.get(t.sampleInHeb).value;
    return {
      ...t,
      distance: hammingDistance(t.sampleInHeb, t.expectedInHeb),
      bestMatch,
      success: bestMatch === t.expectedInHeb,
    };
  });

  console.log(JSON.stringify(result));
}

main();
// translate("שלום עולם", { to: "en" }).then(console.log);
