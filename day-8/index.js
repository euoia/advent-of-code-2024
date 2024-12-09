const { parseArgvFile } = require("../utils");
const Board = require("../Board");
const { Permutation } = require("js-combinatorics");

const input = parseArgvFile("");
const board = new Board(input);

const antinodes = board.clone();

board.draw();

const antennas = board.getCells().reduce((acc, cell) => {
  if (cell.v === ".") {
    return acc;
  }

  if (acc.has(cell.v)) {
    acc.get(cell.v).push(cell);
  } else {
    acc.set(cell.v, [cell]);
  }

  return acc;
}, new Map());

antennas.forEach((cells, antenna) => {
  console.log(`Antenna ${antenna} has ${cells.length} cells.`);
  const pairs = new Permutation(cells, 2);

  [...pairs].forEach(([cell1, cell2]) => {
    const xDistance = cell1.x - cell2.x;
    const yDistance = cell1.y - cell2.y;

    if (antinodes.getCellVal(cell1.x + xDistance, cell1.y + yDistance) !== null) {
      antinodes.setCellVal(cell1.x + xDistance, cell1.y + yDistance, "#");
    }

    if (antinodes.getCellVal(cell2.x - xDistance, cell2.y - yDistance) !== null) {
      antinodes.setCellVal(cell2.x - xDistance, cell2.y - yDistance, "#");
    }
  });
});

antinodes.draw();

console.log([...antinodes.getCells()].filter((cell) => cell.v === "#").length);

