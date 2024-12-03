const { readArgvFile } = require("../utils");
const input = readArgvFile();
const matches = input.matchAll(
  /(?<m>mul\(\d{1,3},\d{1,3}\))|(?<disable>don't\(\))|(?<enable>do\(\))/g,
);

let isEnabled = true;
let total = 0;
for (const match of matches) {
  if (match.groups.enable) {
    isEnabled = true;
    continue;
  }

  if (match.groups.disable) {
    isEnabled = false;
    continue;
  }

  if (isEnabled === false) {
    continue;
  }

  const [a, b] = match.groups.m.match(/\d{1,3}/g).map((n) => parseInt(n));
  total += a * b;
}

console.log(total);
