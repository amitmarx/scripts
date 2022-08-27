const translate = require("translate");
const baseline = require("./baseline.json");
const hammingDistance = require("hamming");
const FuzzyMatching = require("fuzzy-matching");

const toObjByKey = (array, key) =>
  array.reduce((o, item) => {
    o[item[key]] = item;
    return o;
  }, {});

const translateIfNeeded = async (w) =>
  getLanguage(w) === "he" ? w : translate(w, "he");

async function matchWoltAndCibusNames(woltNames, cibusNames) {
  const woltNameToHeb = await Promise.all(
    woltNames.filter(Boolean).map(async (woltName) => ({
      woltName,
      woltHebName: await translateIfNeeded(woltName),
    }))
  );
  const cibusNamesWithHebrew = await Promise.all(
    cibusNames.filter(Boolean).map(async (cibusName) => ({
      cibusName,
      cibusHebName: await translateIfNeeded(cibusName),
    }))
  );

  const allOptions = cibusNamesWithHebrew.map((x) => x.cibusHebName);
  const cibusHebNameToCibusName = toObjByKey(
    cibusNamesWithHebrew,
    "cibusHebName"
  );
  const fm = new FuzzyMatching(allOptions);

  return woltNameToHeb.map(({ woltName, woltHebName }) => {
    const expectedCibusHebName = fm.get(woltHebName).value;
    const cibusName = expectedCibusHebName
      ? cibusHebNameToCibusName[expectedCibusHebName]?.cibusName
      : null;
    return {
      cibusName,
      woltName,
    };
  });
}

function getLanguage(word) {
  const isHeb = (i) => i <= "ת" && i >= "א";
  const isEng = (i) => (i <= "z" && i >= "a") || (i <= "Z" && i >= "A");
  const balance = word
    .split("")
    .reduce(
      (balance, letter) =>
        (balance += !isHeb(letter) && isEng(letter) ? 1 : -1),
      0
    );
  return balance >= 0 ? "en" : "he";
}

// async function main() {
//     const woltNames = baseline.map(x => x.sample)
//     const cibusNames = baseline.map(x => x.expected)
//     const result = await matchWoltAndCibusNames(woltNames, cibusNames)
//     const validation = result.map(x=> {
//         realCibusName = baseline.find(y=> y.sample === x.woltName).expected
//         return {
//             ...x,
//             realCibusName,
//             success: realCibusName === x.cibusName

//         }
//     })
//     console.log(JSON.stringify(validation));
// }

async function main() {
  const wolt = [
    "ארז פפרני",
    "Tomer Binder",
    "Idan Erel",
    "פפרני",
    "Alona Revel",
    "Aviv Ben Shabat",
    "Danny Steinhoff",
    "Tomer Shkolnik",
    "Matias Jurfest",
    "Asaph Noam",
    "Asaph Noam",
    "Or Troyaner",
    "ori price",
    "Yogev Shlomovitz",
    "עידן כהן",
    "Omer Burshtein",
    "Seifan Gertzenstein",
    "Maya Hamo",
    "ליאור חן",
  ];
  const cibus = [
    "",
    "Tomer Binder",
    "Idan Erel",
    "Erez Paperny",
    "Alona Revel",
    "Aviv Ben Shabat",
    "Danny Steinhoff",
    "Tomer Shkolnik",
    "Matias Jurfest",
    "Asaph Noam",
    "Asaph Noam",
    "Or Troyaner",
    "Ori Price 223613",
    "Yogev Shlomovitz",
    "Idan Cohen",
    "Omer Burshtein",
    "Seifan Gertzenstain",
    "Maya Hamo 223685",
    "Lior Chen 223599",
  ];
  const result = await matchWoltAndCibusNames(wolt, cibus)

  console.log(JSON.stringify(result))
}


main();
