const { readArgvFile } = require("../utils");
const input = readArgvFile();
const matches = input.matchAll(
  /(?<m>mul\(\d{1,3},\d{1,3}\))|(?<disable>don't\(\))|(?<enable>do\(\))/g,
);

// console.dir(matches);

let isEnabled = true;
let total = 0;
for (const match of matches) {
  console.dir(match.groups);

  if (match.groups.enable) {
    console.log("Enabling...");
    isEnabled = true;
    continue;
  }

  if (match.groups.disable) {
    console.log("Disabling...");
    isEnabled = false;
    continue;
  }

  if (isEnabled === false) {
    continue;
  }

  console.log("Multiplying...");
  const [a, b] = match.groups.m.match(/\d{1,3}/g).map((n) => parseInt(n));
  total += a * b;
}

console.log(total);
