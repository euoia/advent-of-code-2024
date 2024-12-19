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
}

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

let totalCost = 0;
for (const [regionIdx, cellGroup] of Object.entries(groupedCells)) {
  const fenceCount = cellGroup.reduce((acc, cell) => {
    return acc + Object.values(cell.v.fences).filter((fence) => fence).length;
  }, 0);
  console.dir(
    `${cellGroup[0].v.region} ${regionIdx} has ${cellGroup.length} cells and ${fenceCount} fences.`,
  );
  if (cellGroup[0].v.region === "C") {
    console.log(JSON.stringify(cellGroup, null, 2));
  }
  totalCost += cellGroup.length * fenceCount;
}

console.log(totalCost);
