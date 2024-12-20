const { readArgvFile, awaitUserInput } = require("../utils");
const Board = require("../Board");
const { sortBy, uniqWith } = require("lodash");

const input = readArgvFile();
const boardInput = input.split("\n").slice(0, -1);
const board = new Board(boardInput);
board.draw((c) => c.v);

const startCell = board.getCells().find((c) => c.v === "S");
const endCell = board.getCells().find((c) => c.v === "E");
const startDir = "e";

let rotateCost = 1000;
let stepCost = 1;

const dirs = ["n", "e", "s", "w"];

const oppositeDirs = {
  n: "s",
  e: "w",
  s: "n",
  w: "e",
};

const maxIters = Infinity;
let iters = 0;

const costOfRotation = (d1, d2) => {
  return {
    n: { n: 0, e: 1, w: 1, s: 2 },
    e: { e: 0, n: 1, w: 2, s: 1 },
    s: { s: 0, n: 2, e: 1, w: 1 },
    w: { w: 0, n: 1, e: 2, s: 1 },
  }[d1][d2] * rotateCost;
};

const itemStr = (item) => {
  if (item.cell === null) {
    return `null`;
  }

  return `${item.cell.x},${item.cell.y} d=${item.dir} c=${item.cost}`;
};

const dirChars = {
  n: "^",
  e: ">",
  s: "v",
  w: "<",
};

const drawStack = (stack) => {
  board.draw((cell) => {
    const stackItem = stack.find((si) => si.cell.hasSameLocation(cell));
    if (stackItem) {
      return dirChars[stackItem.dir];
    }

    return cell.v;
  });
};

const solve = async (cell, dir) => {
  let stack = [];
  stack.push({ cell, dir, cost: 0, path: [{ x: cell.x, y: cell.y, dir }] });

  while (stack.length > 0) {
    if (iters++ > maxIters) {
      process.exit(1);
    }

    // drawStack(stack);
    // await awaitUserInput();

    let next = stack.shift();

   // console.log(`popped: `, itemStr(next));
   // board.draw((cell) => {
   //   if (cell.hasSameLocation(next.cell)) {
   //     return "*";
   //   }
   // 
   //   return cell.v;
   // });

   // await awaitUserInput();

    if (iters % 1000 === 0) {
      console.log(
        `${iters} Solving ${next.cell.x},${next.cell.y} ${next.dir} ${next.cost} ${stack.length}`,
      );
    }

    const nextCells = dirs
      .map((d) => {
        const nextCell = next.cell.getAdjacentCell(d);

        if (
          nextCell === null ||
          nextCell.v === "#" ||
          // Don't go backwards.
          d === oppositeDirs[next.dir] ||
          // Loop.
          next.path.some((p) => p.x === nextCell.x && p.y === nextCell.y) ===
            true
        ) {
          return null;
        }

        const cost = next.cost + stepCost + costOfRotation(next.dir, d);
        return {
          dir: d,
          cell: nextCell,
          cost,
          path: [...next.path, { x: nextCell.x, y: nextCell.y, dir: d, cost }],
        };
      })
      .filter(
        (nc) =>
          nc !== null &&
          // Already an item in the stack with a lower cost to this cell.
          stack.some((si) =>
            si.path.some(
              (p) => p.x === nc.cell.x && p.y === nc.cell.y && p.cost < nc.cost && p.dir === nc.dir,
            ),
          ) === false,
      );

    // console.log(`p nextCells`, nextCells);

    const nextEndCell = nextCells.find(
      (nc) => nc.cell.x === endCell.x && nc.cell.y === endCell.y,
    );

    if (nextEndCell !== undefined) {
      console.log(`Found end cell, cost=`, nextEndCell.cost);
      board.draw((cell) => {
        const pathItem = nextEndCell.path.find((p) =>
          p.x === cell.x && p.y === cell.y,
        );

        if (pathItem) {
          return dirChars[pathItem.dir];
        }

        return cell.v;
      });
      process.exit(1);
    }

    stack = uniqWith(
      sortBy([...stack, ...nextCells], "cost"),
      (a, b) =>
        a.cell.x === b.cell.x && a.cell.y === b.cell.y && a.dir === b.dir,
    );
  }

  console.log(`No solution.`);
};

const main = async () => {
  await solve(startCell, startDir);
};

main().then(() => {
});

// 378908 too high.
// 263616
// 269624
// 256616
// 164460
// 266680
// 332756
// 102508
