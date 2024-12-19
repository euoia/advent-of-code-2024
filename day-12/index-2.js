const { parseArgvFile } = require("../utils.js");
const Board = require("../Board.js");
const { groupBy } = require("lodash");

const input = parseArgvFile("");

const board = new Board(input);
board.draw();

const dirs = ["n", "e", "s", "w"];

for (const cell of board.getCells()) {
  cell.setVal({
    region: cell.v,
    fences: {
      n: false,
      e: false,
      s: false,
      w: false,
    },
    regionIdx: null,
  });
}

const floodFill = (cell) => {
  for (const dir of dirs) {
    const adjacentCell = cell.getAdjacentCell(dir);
    if (
      adjacentCell !== null &&
      adjacentCell.v.region === cell.v.region &&
      adjacentCell.v.regionIdx === null
    ) {
      adjacentCell.v.regionIdx = cell.v.regionIdx;
      floodFill(adjacentCell);
    }
  }
};

let regionIdx = 0;
for (const cell of board.getCells()) {
  for (const dir of dirs) {
    const adjacentCell = cell.getAdjacentCell(dir);
    if (adjacentCell === null || adjacentCell.v.region !== cell.v.region) {
      cell.v.fences[dir] = true;
    }

    if (cell.v.regionIdx === null) {
      cell.v.regionIdx = regionIdx++;
      floodFill(cell);
    }
  }

  if (cell.v.regionIdx === null) {
    cell.v.regionIdx = regionIdx++;
  }
}

const groupedCells = groupBy([...board.getCells()], (cell) => cell.v.regionIdx);

const corners = [
  ["n", "w"],
  ["n", "e"],
  ["s", "w"],
  ["s", "e"],
];

let totalCost = 0;
for (const [regionIdx, cellGroup] of Object.entries(groupedCells)) {
  // Sides is the same thing as internal + external corners.
  const sidesCount = cellGroup.reduce((acc, cell) => {
    let cornerCount = 0;
    for (const corner of corners) {
      const [dir1, dir2] = corner;
      
      // "External" corners.
      if (cell.v.fences[dir1] && cell.v.fences[dir2]) {
        console.log(`Cell ${cell.x}, ${cell.y} has an external corner at ${dir1}${dir2}.`);
        cornerCount++;
      }

      // "Internal" corners.
      if (cell.getAdjacentCell(dir1)?.v.region === cell.v.region &&
        cell.getAdjacentCell(dir2)?.v.region  === cell.v.region &&
        cell.getAdjacentCell(`${dir1}${dir2}`)?.v.region !== cell.v.region
      ) {
        console.log(`Cell ${cell.x}, ${cell.y} has an internal corner at ${dir1}${dir2}.`);
        cornerCount++;
      }
    }

    return acc + cornerCount;
  }, 0);

  console.dir(
    `${cellGroup[0].v.region} ${regionIdx} has ${cellGroup.length} cells and ${sidesCount} sides.`,
  );

  totalCost += cellGroup.length * sidesCount;
}

console.log(totalCost);
