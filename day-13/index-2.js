const { gcd, readArgvFile, arraySlices } = require("../utils.js");
const { sortBy } = require("lodash");

const input = readArgvFile();
const lines = input.split("\n");
const machineInputs = arraySlices(lines, 4);
const add = 10000000000000;
// const add = 0;

const machines = machineInputs.reduce((acc, machineInput) => {
  // Button A: X+94, Y+34
  // Button B: X+22, Y+67
  // Prize: X=8400, Y=5400
  const [ax, ay] = machineInput[0].match(/\d+/g).map((n) => parseInt(n));
  const [bx, by] = machineInput[1].match(/\d+/g).map((n) => parseInt(n));
  const [px, py] = machineInput[2].match(/\d+/g).map((n) => parseInt(n));
  acc.push({
    ax,
    ay,
    bx,
    by,
    px: px + add,
    py: py + add,
  });

  return acc;
}, []);

const costA = 3;
const costB = 1;

const machineCosts = machines.map((machine, machineIdx) => {
  console.log(
    `Solving for machine ${machineIdx + 1}/${machines.length}.`,
    machine,
  );

  const xGcd = gcd(machine.ax, machine.bx);
  const canSolveForX = machine.px % xGcd === 0;
  if (canSolveForX === false) {
    console.log(`Cannot solve for X with machine ${machineIdx + 1}.`);
    return null;
  }

  const yGcd = gcd(machine.ay, machine.by);
  const canSolveForY = machine.py % yGcd === 0;
  if (canSolveForY === false) {
    console.log(`Cannot solve for Y with machine ${machineIdx + 1}.`);
    return null;
  }

  const solutions = [];

  // Calculate the initial value for the number of As.
  let maxA = Math.min(
    Math.floor(machine.px / machine.ax),
    Math.floor(machine.py / machine.ay),
  );

  const maxB = Math.min(
    Math.floor(machine.px / machine.bx),
    Math.floor(machine.py / machine.by),
  );

  let minA = Math.max(
    Math.ceil((machine.px - maxB * machine.bx) / machine.ax),
    Math.ceil((machine.py - maxB * machine.by) / machine.ay),
  );

  const minB = Math.max(
    Math.ceil((machine.px - maxA * machine.ax) / machine.bx),
    Math.ceil((machine.py - maxA * machine.ay) / machine.by),
  );

  const aGrad = machine.ax / machine.ay;
  const bGrad = machine.bx / machine.by;

  const solutionsToTry = [
    {
      a: Math.floor((minA + maxA) / 2),
    },
    {
      a: Math.ceil((minA + maxA) / 2),
    },
  ];

  const triedA = new Set();

  while (solutionsToTry.length > 0) {
    const solution = solutionsToTry.pop();
    if (triedA.has(solution.a)) {
      console.log(`Already tried solution A=${solution.a}.`);
      continue;
    }

    triedA.add(solution.a);

    solution.b = (machine.px - solution.a * machine.ax) / machine.bx;
    const solutionX = solution.a * machine.ax + solution.b * machine.bx;
    const solutionY = solution.a * machine.ay + solution.b * machine.by;

    console.log(
      ``,
      `Testing ${solution.a}\n`,
      `X: ${solution.a}*${machine.ax} A + ${solution.b}*${machine.bx} B = ${solutionX} (target ${machine.px})\n`,
      `Y: ${solution.a}*${machine.ay} A + ${solution.b}*${machine.by} B = ${solutionY} (target ${machine.py})\n`,
      `Min A: ${minA}, Max A: ${maxA}, Min B: ${minB}, Max B: ${maxB}`,
    );

    if (solution.b === Math.round(solution.b)) {
      if (solutionX === machine.px && solutionY === machine.py) {
        console.log(
          `Found solution: ${solution.a}*${machine.ax} A + ${solution.b}*${machine.bx} B = ${machine.px}.`,
        );
        solution.cost = solution.a * costA + solution.b * costB;
        solutions.push(solution);
      }
    }

    if (maxA !== minA && solution.a < maxA && solution.a > minA) {
      if (solutionY > machine.py) {
        if (aGrad < bGrad) {
          console.log(
            `${solutionY} > ${machine.py} (Y solution too high, As need to be lower)`,
          );

          maxA = solution.a;
          solutionsToTry.push({
            a: Math.floor((minA + maxA) / 2),
          });
        } else {
          console.log(
            `${solutionY} > ${machine.py} (Y solution too high, As need to be higher)`,
          );
          minA = solution.a;
          solutionsToTry.push({
            a: Math.ceil((minA + maxA) / 2),
          });
        }
      } else {
        if (aGrad < bGrad) {
          console.log(
            `${solutionY} > ${machine.py} (Y solution too low, As need to be higher)`,
          );
          minA = solution.a;
          solutionsToTry.push({
            a: Math.ceil((minA + maxA) / 2),
          });
        } else {
          console.log(
            `${solutionY} > ${machine.py} (Y solution too low, As need to be lower)`,
          );

          maxA = solution.a;
          solutionsToTry.push({
            a: Math.floor((minA + maxA) / 2),
          });
        }
      }
    } else {
      console.log(`No more solutions to try for machine ${machineIdx + 1}.`);
      console.log(`solution.a=${solution.a}, maxA=${maxA}, minA=${minA}`);
    }
  }

  if (solutions.length === 0) {
    console.log(`No solutions found for machine ${machineIdx + 1}.`);
    return null;
  }

  console.log(`Solutions for machine ${machineIdx + 1}:`, solutions, "\n");
  return sortBy(solutions, "cost")[0];
});

console.log(
  machineCosts
    .filter((cost) => cost !== null)
    .reduce((acc, cost) => acc + cost.cost, 0),
);

// (a  * ax) + (b  * bx) = px
// (80 * 94) + (40 * 22) = 8400
//
// How to know if they can't combine, or would require the maximum number of A's
// This is possible e.g. ax=100, bx = 1, px = 1000 (a=10, b=0)
//
// ax=100, bx=1, px=1000
// 1. a=1, b=(1000 - 100) / 1 = 900
//
// Thinking about whether we really need to check the entire range of A's...
//
// Assuming we start at a=1, what does that imply about b?
// * If, to satify X, it requires b value that is far too low for Y...
// * We could work out the max B value and then the implied min A value for each of X and Y.
