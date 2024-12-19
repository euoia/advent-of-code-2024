const { readArgvFile, awaitUserInput } = require("../utils");
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
    return cell.v.size ? "*" : " ";
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

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const getAdjacencyCount = () => robots.reduce((acc, robot) => {
  let adjancentRobots = 0;
  for (const dir of dirs) {
    const x = robot.px + dir[0];
    const y = robot.py + dir[1];
    const adjacentCell = board.get(x, y);
    if (adjacentCell && adjacentCell.v.size > 0) {
      adjancentRobots++;
    }
  }

  return acc + adjancentRobots;
}, 0);

const main = async () => {
  const maxIters = 100000000;
  for (let i = 0; i < maxIters; i++) {
    iterate();

    const adjancentRobots = getAdjacencyCount();
    console.log(`\nIteration ${i}`, `Adjacency count: ${adjancentRobots}`);
    if (adjancentRobots > 500) {
      drawBoard();
      await awaitUserInput();
    }
  }
};

main();

// *******************************
// *                             *
// *                             *
// *                             *
// *                             *                                   |
// *              *              *                     *             |
// *             ***             *                                   |
// *            *****            *                                   |
// *           *******           *                                   |
// *          *********          *                                   |
// *            *****            *                   *               |
// *           *******           *                                   |
// *          *********          *                                   |
// *         ***********         *                                   |
// *        *************        *                                   |
// *          *********          *                      *            |
// *         ***********         *               *                   |
// *        *************        *                                   |
// *       ***************       *              *                    |
// *      *****************      *                  *             *  |
// *        *************        *  *                                |
// *       ***************       *      *                            |
// *      *****************      *                                   |
// *     *******************     *      *                            |
// *    *********************    *          *                        |
// *             ***             *                         *         |
// *             ***             *                                   |
// *             ***             *                                   |
// *                             *                                   |
// *                             *                     *             |
// *                             *                                   |
// *                             *            *        *             |
// *******************************
