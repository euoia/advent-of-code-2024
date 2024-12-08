const fs = require("fs");
const readline = require("readline");

exports.readFile = function (fileName) {
  if (fs.existsSync(fileName) === false) {
    throw new Error(`File ${fileName} does not exist.`);
  }

  return fs.readFileSync(fileName, "utf-8");
}

exports.readArgvFile = function () {
  return exports.readFile(process.argv[2]);
};

exports.parseArgvFile = function (split = " ", mapFn = (n) => n) {
  const input = exports.readFile(process.argv[2]);

  const lines = [];
  for (const line of input.split("\n")) {
    if (line === "") {
      continue;
    }

    lines.push(line.split(split).map(mapFn));
  }

  return lines;
};

exports.arrayWindows = function* (arr, size) {
  if (size > arr.length) {
    throw new Error("Size is greater than array length.");
  }

  for (let i = 0; i <= arr.length - size; i++) {
    yield arr.slice(i, i + size);
  }
};

exports.arraySlices = function* (arr, size) {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
};

exports.swapElementsByValue = function (arr, v1, v2) {
  const v1Idx = arr.indexOf(v1);
  const v2Idx = arr.indexOf(v2);

  arr[v1Idx] = v2;
  arr[v2Idx] = v1;
};

let rl = null;
exports.awaitUserInput = function (prompt) {
  if (rl === null) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Close rl on programme exit.
    process.on("exit", () => {
      rl.close();
    });
  }

  return new Promise((resolve) => {
    console.log("");
    rl.question(prompt ?? "Continue...", resolve);
  });
};
