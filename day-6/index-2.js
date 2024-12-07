const { parseArgvFile } = require("../utils");
const { awaitUserInput } = require("../utils");
const Guard = require("./Guard.js");
const Board = require("../Board");

const input = parseArgvFile("");
const board = new Board(input);
const obstacleCells = new Set();
const checkedCells = [];

// Store the path the guard has taken.
const guard = new Guard(board);
guard.cell = board.getCells().find((cell) => cell.v === "^");

const wouldPuttingAnObstacleInFrontCauseALoop = async () => {
  if (guard.cellInFront === null) {
    return false;
  }

  const ghostGuard = guard.clone();
  ghostGuard.cellInFront.setVal("O");
  ghostGuard.rotate();

  while (ghostGuard.cell !== null) {
    ghostGuard.step();

    // board.draw(ghostGuard, obstacleCells);
    // await awaitUserInput("Ghost...");

    if (ghostGuard.isInLoop) {
      return true;
    }
  }

  return false;
};

const stepUntilDone = async () => {
  while (guard.cell !== null && guard.cellInFront !== null) {
    // TODO: This is quite slow. We could cache the ghost paths so we don't
    // repeatedly check the same routes.

    if (
      checkedCells.some(
        (c) => c.x === guard.cellInFront.x && c.y === guard.cellInFront.y,
      ) === false
    ) {
      if (await wouldPuttingAnObstacleInFrontCauseALoop()) {
        obstacleCells.add(guard.cellInFront);
      }

      checkedCells.push(guard.cellInFront);
    } else {
      console.log("Already checked this cell.");
    }

    guard.step();
    console.log(guard.stepsTaken, obstacleCells.size);

    // board.draw(guard, obstacleCells);
    // await awaitUserInput("Guard...");
  }
};

async function main() {
  await stepUntilDone();

  console.log(obstacleCells);
  board.draw(guard, obstacleCells);
  console.log(obstacleCells.size);
  process.exit(0);
}

main();

// 380 is too low.
// 1015 is too low.
// 1707 is not right.
// 1543 is not right.
// 1590 is not right.
