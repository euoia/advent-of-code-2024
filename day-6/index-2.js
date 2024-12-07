const { parseArgvFile } = require("../utils");
const { awaitUserInput } = require("../utils");
const Guard = require("./Guard.js");
const Board = require("../Board");

const input = parseArgvFile("");
const board = new Board(input);
const obstacleCells = new Set();

const stepUntilDone = async () => {
  // Check all free cells.
  const cellsToCheck = board.getCells().filter((cell) => cell.v === ".");

  const startCell = board.getCells().find((cell) => cell.v === "^");

  for (const checkCell of cellsToCheck) {
    checkCell.setVal("O");

    const guard = new Guard(board);
    guard.cell = startCell;

    while (guard.cell !== null && guard.isInLoop === false) {
      guard.step();
      // board.draw(guard, obstacleCells);
      // await awaitUserInput("Guard...");
    }

    if (guard.isInLoop) {
      obstacleCells.add(checkCell);
    }

    checkCell.setVal(".");
  }
};

async function main() {
  await stepUntilDone();

  board.draw(null, obstacleCells);
  console.log(obstacleCells.size);
  process.exit(0);
}

main();
