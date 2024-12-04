const { parseArgvFile } = require("../utils");
const Board = require("../Board");

const input = parseArgvFile("");

const board = new Board(input);

const count = board.getCells().reduce((acc, cell) => {
  acc += Object.values(
    board.getAllCompassCellsInDirectionFromCell(cell.x, cell.y, 4),
  ).filter((vals) => vals.join("") === "XMAS").length;
  return acc;
}, 0);

console.log(count);
