const { readArgvFile } = require("../utils");
const Board = require("../Board");

const input = readArgvFile();
const lines = input.split("\n").slice(0, -1);

const robots = lines.map((line) => {
  const [px, py, vx, vy] = line.match(/-?\d+/g).map(Number);
  return { px, py, vx, vy };
});

const board = new Board([[]]);
// board.initialize(11, 7, () => new Set());
board.initialize(101, 103, () => new Set());

for (const robot of robots) {
  board.set(robot.px, robot.py, (v) => v.add(robot));
}

const drawBoard = () => {
  board.draw((cell) => {
    return cell.v.size || ".";
  });
};

const drawQuadrants = () => {
  board.draw((cell) => {
    if (cell.x === (board.width - 1) / 2 || cell.y === (board.height - 1) / 2) {
      return '*';
    }
    return cell.v.size || ".";
  });
};

const iterate = () => {
  for (const robot of robots) {
    board.get(robot.px, robot.py).v.delete(robot);
    robot.px += robot.vx;
    robot.py += robot.vy;
    if (robot.px < 0) {
      robot.px += board.width;
    }
    if (robot.px >= board.width) {
      robot.px -= board.width;
    }
    if (robot.py < 0) {
      robot.py += board.height;
    }
    if (robot.py >= board.height) {
      robot.py -= board.height;
    }
    board.set(robot.px, robot.py, (v) => v.add(robot));
  }
};

const maxIters = 100;
for (let i = 0; i < maxIters; i++) {
  iterate();

  console.log(`\n\nIteration ${i}:\n`);
  drawBoard();
}

const quadrants = board.getCells().reduce((acc, cell) => {
  if (cell.x === (board.width - 1) / 2 || cell.y === (board.height - 1) / 2) {
  return acc;
  }

  let quadrant = null;
  if (cell.y < (board.height - 1) / 2) {
    if (cell.x < (board.width - 1) / 2) {
      quadrant = 1;
    } else {
      quadrant = 2;
    }
  } else if (cell.y > board.height / 2) {
    if (cell.x < (board.width - 1) / 2) {
      quadrant = 3;
    } else if (cell.x > board.width / 2) {
      quadrant = 4;
    }
  }

  return acc.set(quadrant, (acc.get(quadrant) || 0) + cell.v.size);
}, new Map());

drawQuadrants();

console.log(quadrants);
console.log([...quadrants].reduce((mul, [k, v]) => mul * (k !== null ? v : 1), 1));

// 223652352
// 221655456
