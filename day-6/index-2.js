const { parseArgvFile } = require("../utils");
const { awaitUserInput } = require("../utils");
const Guard = require("./Guard.js");
const Board = require("../Board");

const input = parseArgvFile("");
const board = new Board(input);
const obstacleCells = new Set();

const stepUntilDone = async () => {
  const cellsToCheck = board.getCells().filter((cell) => cell.v === ".");
  for (const cell of cellsToCheck) {
    cell.setVal("O");

    // Store the path the guard has taken.
    const guard = new Guard(board);
    guard.cell = board.getCells().find((cell) => cell.v === "^");

    while (guard.cell !== null && guard.isInLoop === false) {
      guard.step();
      // board.draw(guard, obstacleCells);
      // await awaitUserInput("Guard...");
    }

    if (guard.isInLoop) {
      obstacleCells.add(cell);
    }

    cell.setVal(".");
  }
};

async function main() {
  await stepUntilDone();

  board.draw(null, obstacleCells);
  console.log(obstacleCells.size);
  process.exit(0);
}

main();
