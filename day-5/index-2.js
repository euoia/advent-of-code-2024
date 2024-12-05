const { parseArgvFile, swapElementsByValue } = require("../utils");
const { Combination } = require("js-combinatorics");
const { partition } = require("lodash");

const input = parseArgvFile();

const afterBefore = new Map();
const prints = [];

for (let line of input) {
  line = line[0];
  if (line.includes("|")) {
    // Pairs.
    const [before, after] = line.split("|").map((n) => parseInt(n));

    afterBefore.set(
      after,
      afterBefore.has(after)
        ? afterBefore.get(after).add(before)
        : new Set([before]),
    );
  }

  if (line.includes(",")) {
    // Prints.
    prints.push(line.split(",").map((n) => parseInt(n)));
  }
}

// eslint-disable-next-line no-unused-vars
const [goodPrints, badPrints] = partition(prints, ((print) => {
  const printPairs = new Combination(print, 2);
  // Given a pair of numbers, the rules are violated if the second number must
  // be printed before the first one.
  //
  for (const [before, after] of printPairs) {
    // For this pair, if there is a rule containing the pair of numbers in the
    // other order, then the print is bad.
    if (afterBefore.get(before) && afterBefore.get(before).has(after)) {
      return false;
    }
  }

  return true;
}));

const fixPrint = (print) => {
  const printPairs = new Combination(print, 2);

  for (const [before, after] of printPairs) {
    if (afterBefore.get(before) && afterBefore.get(before).has(after)) {
      // Rule is violated, swap the elements.
      swapElementsByValue(print, before, after);

      // Start again incase earlier rules are now violated.
      fixPrint(print);
      return;
    }
  }
}

for (const badPrint of badPrints) {
  fixPrint(badPrint)
}

 const middleNumbers = badPrints.map((print) => print[(print.length - 1) / 2]);
 console.log(middleNumbers.reduce((acc, n) => acc + n, 0));
