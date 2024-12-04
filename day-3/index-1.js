const { readArgvFile } = require("../utils");
const input = readArgvFile();
const matches = input.match(/mul\(\d{1,3},\d{1,3}\)/g);

let total = 0;
for (const match of matches) {
  const [a, b] = match.match(/\d{1,3}/g).map((n) => parseInt(n));
  total += a * b;
}

console.log(total);
