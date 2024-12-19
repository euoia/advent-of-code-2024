const { readArgvFile, awaitUserInput } = require("../utils");
const Board = require("../Board");

const input = readArgvFile();

const lines = input.split("\n");
const boardInput = [];

let lineIdx = 0;
for (lineIdx in lines) {
  const line = lines[lineIdx]
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replaceAll("@", "@.");
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
  const cellsToMove = [];

  const hasSeen = (cell) => cellsToMove.some((c) => c.hasSameLocation(cell));

  const frontierCells = [board.get(rx, ry)];
  while (frontierCells.length > 0) {
    const cell = frontierCells.shift();

    if (cell === null || cell.v === "." || hasSeen(cell)) {
      continue;
    }

    cellsToMove.push(cell);

    switch (cell.v) {
      case "@":
        frontierCells.push(board.get(cell.x + dx, cell.y + dy));
        break;
      case "#":
        // Cannot move.
        return;
      case "[":
        frontierCells.push(board.get(cell.x + 1, cell.y));
        frontierCells.push(board.get(cell.x + dx, cell.y + dy));
        break;
      case "]":
        frontierCells.push(board.get(cell.x - 1, cell.y));
        frontierCells.push(board.get(cell.x + dx, cell.y + dy));
        break;
    }
  }

  console.log(cellsToMove.map((c) => c.toString()));

  cellsToMove.reverse().forEach((cell) => {
    const adjCell = board.get(cell.x + dx, cell.y + dy);
    adjCell.setVal(cell.v);
    cell.setVal(".");
  });

  board.get(rx, ry).setVal(".");
  rx += dx;
  ry += dy;
};

const main = async () => {
  while (moves.length > 0) {
    const move = moves.shift();
    console.log(move, `(${moves.length} moves left)`);
    applyMove(move);
    //board.draw((celll) => celll.v);
    // await awaitUserInput();
  }
};

main().then(() => {
  console.log(
    [...board.getCells()]
      .filter((c) => c.v === "[")
      .reduce((acc, cell) => acc + 100 * cell.y + cell.x, 0),
  );
});
