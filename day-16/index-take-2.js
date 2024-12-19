const { readArgvFile } = require("../utils");
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

const addToPath = (path, cell) => {
  return [...path, [cell.x, cell.y]];
};

const pathContainsCell = (path, cell) => {
  return path.some(([cx, cy]) => cx === cell.x && cy === cell.y);
};

let minCost = Infinity;

const oppositeDirs = {
  n: "s",
  s: "n",
  e: "w",
  w: "e",
};

const maxIters = Infinity;
let iters = 0;

const cellMins = new Map();

const solve = (cell, dir, cost = 0, path = []) => {
  if (iters++ % 1000 === 0) {
    console.log(`${iters} Solving ${cell.x},${cell.y} ${dir} ${cost}`);
  }

  if (iters > maxIters) {
    process.exit(1);
  }

  if (cell.hasSameLocation(endCell)) {
    return cost;
  } else if (cell.v === "#") {
    return Infinity;
  } else if (cost > minCost) {
    console.log(`Pruning ${cost} > ${minCost}`);
    return Infinity;
  }

  let nextCells;
  while (true) {
    nextCells = dirs
      .map((d) => ({
        d,
        cell: cell.getAdjacentCell(d),
      }))
      .filter(
        (nc) =>
          pathContainsCell(path, nc) === false &&
          nc.d !== oppositeDirs[dir] &&
          nc.v !== "#",
      );

    if (nextCells.length === 1) {
      cost += stepCost;
      cell = nextCells[0].cell;
    } else {
      break;
    }
  }

  const pathCosts = nextCells
    .map((vc) => {
      if (cellMins.has(vc.cell)) {
        return cost + cellMins.get(vc.cell);
      }

      const costOfRotation =
        Math.abs(dirs.indexOf(vc.d) - dirs.indexOf(dir)) * rotateCost;

      return solve(vc.cell, vc.d, costOfRotation + stepCost + cost, [
        ...path,
        [cell.x, cell.y],
      ]);
    })
    .filter((c) => c !== Infinity)
    .sort((a, b) => a - b);

  if (pathCosts.length === 0) {
    return Infinity;
  }

  console.log(pathCosts);

  minCost = Math.min(minCost, ...pathCosts);
  cellMins.set(cell, minCost);
  // console.log(`Min cost: ${minCost}`);

  return cost + cellMins.get(cell);
};

console.log(solve(startCell, startDir, 0));

// 378908 too high.
// 263616
// 269624
// 256616
