const { parseArgvFile, arrayWindows } = require("../utils");
const { Combination } = require("js-combinatorics");

const reports = parseArgvFile(" ", (n) => parseInt(n));

function isGood(report) {
  const isIncreasing = report[1] > report[0];

  return arrayWindows(report, 2).every(([current, next]) => {
    const diff = Math.abs(next - current);

    return (
      diff >= 1 &&
      diff <= 3 &&
      ((next > current && isIncreasing) ||
        (next < current && isIncreasing === false))
    );
  });
}

const goodReports = [];
for (const report of reports) {
  const reportsToTry = new Combination(report, report.length - 1);

  if ([...reportsToTry].some((report) => isGood(report))) {
    goodReports.push(report);
  }
}

console.log(
  goodReports.length + " out of " + reports.length + " reports are good.",
);
