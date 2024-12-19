const { readArgvFile, arraySlices } = require("../utils.js");
const { sortBy } = require("lodash");

const input = readArgvFile();
const lines = input.split("\n");
const machineInputs = arraySlices(lines, 4);

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
    px,
    py,
  });

  return acc;
}, []);

const costA = 3;
const costB = 1;

const machineCosts = machines.map((machine, machineIdx) => {
  console.log(`Solving for machine ${machineIdx + 1}/${machines.length}.`);
  const solutions = [];
  const solutionsToTry = [
    {
      a: 1,
    },
  ];

  while (solutionsToTry.length > 0) {
    const solution = solutionsToTry.pop();
    solution.b = (machine.px - solution.a * machine.ax) / machine.bx;
    solution.cost = solution.a * costA + solution.b * costB;
    if (solution.b === Math.round(solution.b)) {
      console.log(
        `Testing solution: ${solution.a}*${machine.ax} A + ${solution.b}*${machine.bx} B = ${machine.px}.`,
      );

      const solutionX = solution.a * machine.ax + solution.b * machine.bx;
      const solutionY = solution.a * machine.ay + solution.b * machine.by;
      if (solutionX === machine.px && solutionY === machine.py) {
        console.log(
          `Found solution (break): ${solution.a}*${machine.ax} A + ${solution.b}*${machine.bx} B = ${machine.px}.`,
        );
        solutions.push(solution);
        // break;
      }
    }

    if (solution.b > 0) {
      solutionsToTry.push({
        a: solution.a + 1,
      });
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

// (80 * 94) + (40 * 22)
