const Board = require("../Board");
const { parseArgvFile } = require("../utils");
const { uniqWith } = require("lodash");

const board = new Board(parseArgvFile("", (n) => parseInt(n)));

// n, e, s, w.
const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const getTrailsFromCell = (cell, path = []) => {
  if (cell.v === 9) {
    return [path];
  }

  const nextVal = cell.v + 1;

  return dirs
    .map(([xOffset, yOffset]) =>
      board.getCell(cell.x + xOffset, cell.y + yOffset)
    )
    .filter((nextCell) => nextCell && nextCell.v === nextVal)
    .flatMap((nextCell) => {
      return getTrailsFromCell(nextCell, [...path, cell, nextCell]);
    });
};

const trailHeads = [...board.getCells()]
  .filter((cell) => cell.v === 0)
  .map((cell) => {
    return getTrailsFromCell(cell, [cell]);
  });

const uniqueEndpoints = (trails) =>
  uniqWith(
    trails.map((trail) => trail[trail.length - 1]),
    (endpoint1, endpoint2) => endpoint1.hasSameLocation(endpoint2),
  );

const score = trailHeads.reduce((acc, trails) => acc + uniqueEndpoints(trails).length, 0);

console.log(score);
