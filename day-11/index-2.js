const { readArgvFile, stringSlices } = require("../utils");

const input = readArgvFile();
const startingStones = input
  .split(" ")
  .map((n) => parseInt(n))
  .reduce((acc, v) => acc.set(v, 1 + (acc.get(v) || 0)), new Map());

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
  return [...stones].reduce((newStones, [stone, count]) => {
    for (const newStone of applyRules(stone)) {
      newStones.set(newStone, (newStones.get(newStone) || 0) + count);
    }

    return newStones;
  }, new Map());
};

let stones = startingStones;
const max = 75;
for (let i = 0; i < max; i++) {
  stones = blink(stones);
}

const numStones = [...stones].reduce((acc, [v]) => acc + stones.get(v), 0);
console.log(`${max} blinks`, numStones);
