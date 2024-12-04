const { parseArgvFile, arrayWindows } = require("../utils");

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

const goodReports = reports.filter(report => isGood(report));

console.log(
  goodReports.length + " out of " + reports.length + " reports are good.",
);
