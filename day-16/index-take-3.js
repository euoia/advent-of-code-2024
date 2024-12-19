const { readArgvFile, awaitUserInput } = require("../utils");
const Board = require("../Board");

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
  if (dirs.includes(d1) === false || dirs.includes(d2) === false) {
    throw new Error(`Invalid direction: ${d1} or ${d2}`);
  }
  return Math.abs(dirs.indexOf(d1) - dirs.indexOf(d2)) * rotateCost;
};

const itemStr = (item) => {
  if (item.cell === null) {
    return `null`;
  }

  return `${item.cell.x},${item.cell.y} d=${item.dir} c=${item.cost}`;
};

const drawStack = (stack) => {
  board.draw((cell) => {
    const stackItem = stack.find((si) => si.cell.hasSameLocation(cell));
    if (stackItem) {
      return {
        n: "^",
        e: ">",
        s: "v",
        w: "<",
      }[stackItem.dir];
    }

    return cell.v;
  });
};

const solve = async (cell, dir, cost = 0) => {
  let stack = [];
  stack.push({ cell, dir, cost, path: [{ x: cell.x, y: cell.y, dir }] });

  while (stack.length > 0) {
    if (iters++ > maxIters) {
      process.exit(1);
    }

    drawStack(stack);
    await awaitUserInput();

    let next = stack.shift();

    console.log(`popped: `, itemStr(next));
    board.draw((cell) => {
      if (cell.hasSameLocation(next.cell)) {
        return "*";
      }

      return cell.v;
    });

    await awaitUserInput();

    if (iters % 1000 === 0) {
      console.log(
        `${iters} Solving ${next.cell.x},${next.cell.y} ${next.dir} ${next.cost} ${stack.length}`,
      );
    }

    const nextCells = dirs
      .map((d) => {
        const nextCell = next.cell.getAdjacentCell(d);

        if (
          next.dir === oppositeDirs[next.dir] ||
          nextCell === null ||
          nextCell.v === "#" ||
          next.path.some((p) => p.x === nextCell.x && p.y === nextCell.y) ===
            true
        ) {
          return null;
        }

        // TODO: Don't include if there are stack items with a path item that has this cell but with a lower cost.
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
              (p) => p.x === nc.cell.x && p.y === nc.cell.y && p.cost < nc.cost,
            ),
          ) === false,
      );

    // console.log(`p nextCells`, nextCells);

    const nextEndCell = nextCells.find((nc) =>
      nc.cell.hasSameLocation(endCell),
    );

    if (nextEndCell !== undefined) {
      console.log(`Found end cell, cost=`, nextEndCell.cost);
      process.exit(1);
    }

    const newStack = [];
    for (const stackItem of stack) {
      let itemToPush = stackItem;

      // Ensure unique x,y,dir.
      const nextCellIdx = nextCells.findIndex(
        (nextCell) =>
          stackItem.cell.x === nextCell.cell.x &&
          stackItem.cell.y === nextCell.cell.y &&
          stackItem.dir === nextCell.dir &&
          stackItem.cost > nextCell.cost,
      );

      if (nextCellIdx !== -1) {
        console.log(
          `replace=${itemToPush}`,
          itemStr(stackItem),
          itemStr(nextCells[nextCellIdx]),
        );
        itemToPush = nextCells[nextCellIdx];
        nextCells.splice(nextCellIdx, 1);
      }

      newStack.push(itemToPush);
    }

    newStack.push(...nextCells);
    newStack.sort((a, b) => a.cost - b.cost);
    stack = newStack;
  }
};

const main = async () => {
  await solve(startCell, startDir, 0);
};

main().then(() => {
  console.log(`Done`);
});

// 378908 too high.
// 263616
// 269624
// 256616
// 164460
// 266680
// 332756
