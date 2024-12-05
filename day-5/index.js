const { parseArgvFile } = require("../utils");
const { Combination } = require("js-combinatorics");

const input = parseArgvFile();

const beforeAfter = new Map();
const afterBefore = new Map();
const prints = [];

for (let line of input) {
  line = line[0];
  if (line.includes("|")) {
    const [before, after] = line.split("|").map((n) => parseInt(n));

    beforeAfter.set(
      before,
      beforeAfter.has(before)
        ? beforeAfter.get(before).add(after)
        : new Set([after]),
    );

    afterBefore.set(
      after,
      afterBefore.has(after)
        ? afterBefore.get(after).add(before)
        : new Set([before]),
    );
  }

  if (line.includes(",")) {
    prints.push(line.split(",").map((n) => parseInt(n)));
  }
}

const goodPrints = prints.filter((print) => {
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
});

const middleNumbers = goodPrints.map((print) => print[(print.length - 1) / 2]);

console.log(goodPrints);
console.log(middleNumbers);
console.log(middleNumbers.reduce((acc, n) => acc + n, 0));
