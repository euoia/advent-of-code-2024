const { readArgvFile, arrayWindows } = require("../utils");
const Board = require("../Board");

const input = readArgvFile();

const lines = input.split("\n");
const boardInput = [];

let lineIdx = 0;
for (lineIdx in lines) {
  const line = lines[lineIdx];
  if (line === "") {
    break;
  }

  boardInput.push(line);
}

let moves = [];
for (let i = lineIdx; i < lines.length; i++) {
  const line = lines[i];
  moves.push(...line.split(""));
}

const board = new Board(boardInput);
board.draw((celll) => celll.v);

const moveDirs = {
  "<": [-1, 0],
  ">": [1, 0],
  "^": [0, -1],
  v: [0, 1],
};

const robotCell = board.getCells().find((cell) => cell.v === "@");
let rx = robotCell.x;
let ry = robotCell.y;

const applyMove = (move) => {
  const [dx, dy] = moveDirs[move];
  const stack = [board.get(rx, ry)];

  let canMove = false;
  while (true) {
    const stackCell = board.get(
      robotCell.x + dx * stack.length,
      robotCell.y + dy * stack.length,
    );

    if (stackCell === null || stackCell.v === "#") {
      break;
    }

    stack.push(stackCell);

    if (stackCell.v === ".") {
      canMove = true;
      break;
    }
  }

  console.log(
    `stack`,
    canMove,
    stack.map((c) => {
      return { x: c.x, y: c.y, v: c.v };
    }),
  );

  if (canMove === false) {
    return;
  }

  for (const [cell, nextCell] of arrayWindows(stack.reverse(), 2)) {
    if (nextCell === undefined) {
      break;
    }

    const tmp = nextCell.v;
    nextCell.setVal(cell.v);
    cell.setVal(tmp);
  }

  rx += dx;
  ry += dy;
};

while (moves.length > 0) {
  const move = moves.shift();
  console.log(move);
  applyMove(move);
  board.draw((celll) => celll.v);
}

console.log(
  [...board.getCells()]
    .filter((c) => c.v === "O")
    .reduce((acc, cell) => acc + 100 * cell.y + cell.x, 0),
);
