const { parseArgvFile } = require("../utils");
const Board = require("../Board");
const input = parseArgvFile("");
const board = new Board(input);

let guardCell = board.getCells().find((cell) => cell.v === "^");
const guardDirections = ["n", "e", "s", "w"];
let guardDirectionIdx = 0;

const rotateGuard = () => {
  guardDirectionIdx = (guardDirectionIdx + 1) % guardDirections.length;
};

const guardDirection = () => guardDirections[guardDirectionIdx];

const cellInFrontOfGuard = () => {
  return board.getCellInDirectionFromCell(
    guardCell.x,
    guardCell.y,
    guardDirection(),
  );
};

const canStepForward = () => {
  const cellInFront = cellInFrontOfGuard();
  return cellInFront === null || cellInFront.v !== "#";
};

const stepForward = () => {
  board.setCellVal(guardCell.x, guardCell.y, "X"); // Mark where we have been.
  guardCell = board.getCellInDirectionFromCell(
    guardCell.x,
    guardCell.y,
    guardDirection(),
  );

  if (guardCell !== null) {
    board.setCellVal(guardCell.x, guardCell.y, "^");
  }
};

const stepGuard = () => {
  if (canStepForward()) {
    stepForward();
  } else {
    rotateGuard();
  }
};

const stepUntilDone = () => {
  while (guardCell !== null) {
    stepGuard();
  }
};

stepUntilDone();
const visitedCells = [...board.getCells()].filter((cell) => cell.v === "X");
console.log(visitedCells.length);
