const fs = require("fs");

// const input = fs.readFileSync("test-input-1.txt");
const input = fs.readFileSync("input-1.txt");

const list1 = [];
const list2 = [];

for (const line of input.toString().split("\n")) {
  const [a, b] = line.split("  ");

  if (isNaN(a) || isNaN(b)) {
    continue;
  }

  list1.push(parseInt(a));
  list2.push(parseInt(b));
}


const occurences = new Map()
for (const val of list2) {
  if (occurences.has(val)) {
    occurences.set(val, occurences.get(val) + 1);
  } else {
    occurences.set(val, 1);
  }
}

let score = 0;
for (const val of list1) {
  if (occurences.has(val)) {
    score += occurences.get(val) * val;
  }
}

console.log(score);
