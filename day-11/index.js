const { readArgvFile, stringSlices } = require("../utils");

const input = readArgvFile();
const startingStones = input.split(" ").map((n) => parseInt(n));

const applyRules = (stone) => {
  if (stone === 0) {
    return [1];
  }

  const stoneAsString = stone.toString();
  if (stoneAsString.length % 2 === 0) {
    const [left, right] = stringSlices(stoneAsString, stoneAsString.length / 2);
    return [parseInt(left), parseInt(right)];
  }

  return [stone * 2024];
};

const blink = (stones) => {
  return stones.flatMap(applyRules);
};

let stones = startingStones;
const max = 75;
for (let i = 0; i < max; i++) {
  console.log(`${i} blinks`, stones.length);
  stones = blink(stones);
}
console.log(`${max} blinks`, stones.length);
