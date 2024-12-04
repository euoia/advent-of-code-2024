const { parseArgvFile } = require("../utils");
const Board = require("../Board");

const input = parseArgvFile("");

const board = new Board(input);

const count = board.getCells().reduce((acc, cell) => {
  const diagonals = board.getDiagonalsAroundCell(cell.x, cell.y, 1);
  const matchedDiagonals = diagonals.filter((d) => d.join("") === "MAS" || d.join("") === "SAM");
  return acc + (matchedDiagonals.length === 2)
}, 0);

console.log(count);
