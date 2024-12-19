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
let minCosts = [];

const dirs = ["n", "e", "s", "w"];

const addToPath = (path, cell) => {
  return [...path, cell];
};

const pathContainsCell = (path, cell) => {
  return path.some((c) => c.hasSameLocation(cell));
};

const setMinCostFromCell = (cell, dir, cost) => {
  if (minCosts[cell.x] === undefined) {
    minCosts[cell.x] = [];
  }

  if (minCosts[cell.x][cell.y] === undefined) {
    minCosts[cell.x][cell.y] = [];
  }

  if (minCosts[cell.x][cell.y][dir] === undefined) {
    minCosts[cell.x][cell.y][dir] = Infinity;
  }

  minCosts[cell.x][cell.y][dir] = Math.min(minCosts[cell.x][cell.y][dir], cost);
};

const getMinCostFromCell = (cell, dir) => {
  return minCosts[cell.x]?.[cell.y]?.[dir] ?? null;
};

const oppositeDirs = {
  n: "s",
  s: "n",
  e: "w",
  w: "e",
};

const startTime = Date.now();

const solve = (cell, dir, path = []) => {
  console.log(`Solving ${cell.x},${cell.y} ${dir}`);

  const minCostFromCell = getMinCostFromCell(cell, dir);
  if (minCostFromCell !== null) {
    console.log(`Cost from ${cell.x},${cell.y} ${dir} =${minCostFromCell}`);
    return minCostFromCell;
  }

  if (cell.hasSameLocation(endCell)) {
    // board.draw((c) => {
    //   if (pathContainsCell(path, c)) {
    //     return "o";
    //   }
    //   return c.v;
    // });
    // const elapsed = Date.now() - startTime;
    // console.log(`Elapsed ${elapsed} cost`, cost);
    return 0;
  }

  const nextCells = dirs
    .filter((d) => d !== oppositeDirs[dir])
    .map((d) => ({
      d,
      cell: cell.getAdjacentCell(d),
    }));

  const validCells = nextCells.filter(
    (nc) =>
      nc.cell && nc.cell.v !== "#" && pathContainsCell(path, nc.cell) === false,
  );

  if (validCells.length === 0) {
    // Reached a dead end.
    return Infinity;
  }

  const pathCosts = validCells
    .map((vc) => {
      const costOfRotation =
        Math.abs(dirs.indexOf(vc.d) - dirs.indexOf(dir)) * rotateCost;

      return (
        costOfRotation + stepCost + solve(vc.cell, vc.d, addToPath(path, cell))
      );
    })
    .sort((a, b) => a - b);

  if (pathCosts.length === 0) {
    return Infinity;
  }

  const minCost = pathCosts[0];
  if (minCost < Infinity) {
    setMinCostFromCell(cell, dir, minCost);
    console.log(
      `Min cost from ${cell.x},${cell.y} ${dir}=${getMinCostFromCell(cell, dir)}`,
    );
  }

  // board.draw((c) => {
  //   if (pathContainsCell(path, c)) {
  //     return "o";
  //   }
  //   return c.v;
  // });

  return minCost;
};

console.log(solve(startCell, startDir, []));
console.log(minCosts[startCell.x][startCell.y][startDir]);

// 378908 too high.
// 263616
// 269624
// 256616
