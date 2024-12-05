const fs = require("fs");

exports.readArgvFile = function () {
  const fileName = process.argv[2];

  if (fs.existsSync(fileName) === false) {
    throw new Error(`File ${fileName} does not exist.`);
  }

  return fs.readFileSync(fileName, "utf-8");
}

exports.parseArgvFile = function (split = " ", mapFn = (n) => n) {
  const fileName = process.argv[2];
  if (fs.existsSync(fileName) === false) {
    throw new Error(`File ${fileName} does not exist.`);
  }

  const input = fs.readFileSync(process.argv[2], "utf-8");

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

exports.swapElementsByValue = function (arr, v1, v2) {
  const v1Idx = arr.indexOf(v1);
  const v2Idx = arr.indexOf(v2);

  arr[v1Idx] = v2;
  arr[v2Idx] = v1;
}
