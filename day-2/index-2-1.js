const fs = require("fs");

//const input = fs.readFileSync("test-input.txt");
const input = fs.readFileSync("input.txt");

const reports = [];

for (const line of input.toString().split("\n")) {
  if (line === "") {
    continue;
  }

  reports.push(line.split(" ").map(n => parseInt(n)));
}

const goodReports = [];
for (const report of reports) {
  const isIncreasing = report[0] < report[1];

  let isGood = true;

  for (let i = 1; i < report.length; i++) {
    const previous = report[i - 1];
    const current = report[i];
    const diff = Math.abs(previous - current);

    if (diff < 1 || diff > 3) {
      isGood = false;
    }

    if (previous >= current && isIncreasing) {
      console.log(`bad because is increasing`, previous, current);
      isGood = false;
    }

    if (previous <= current && isIncreasing === false) {
      console.log(`bad because not increasing`, previous, current);
      isGood = false;
    }
  }

  if (isGood) {
    goodReports.push(report);
  }
}

console.dir(goodReports);
console.log(goodReports.length);
