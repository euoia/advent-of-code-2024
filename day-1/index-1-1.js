const fs = require("fs");

// const input = fs.readFileSync("test-input-1.txt");
const input = fs.readFileSync("input-1.txt");

console.log(input.toString());

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



list1.sort();
list2.sort();

console.log(list1);
console.log(list2);

let distance = 0;
for (let i = 0; i < list1.length; i++) {
  distance += Math.abs(list1[i] - list2[i]);
}

console.log(distance);
