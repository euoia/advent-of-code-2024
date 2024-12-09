const { readArgvFile, arrayWindows } = require("../Utils");

const input = readArgvFile();
const lines = input.split("\n").filter((line) => line !== "");

const equations = [];
for (const line of lines) {
  const [target, numbersStr] = line.split(": ");

  const numbers = numbersStr.split(" ").map((n) => parseInt(n));
  equations.push({ target: parseInt(target), numbers });
}

const operands = [
  {
    name: "ADD",
    fn: (v1, v2) => v1 + v2,
  },
  {
    name: "MUL",
    fn: (v1, v2) => v1 * v2,
  },
  {
    name: "CAT",
    fn: (v1, v2) => parseInt(`${v1}${v2}`),
  },
];

const canSolve = (target, numbers, ops = []) => {
  for (const operand of operands) {
    const [v1, v2] = numbers.slice(0, 2);

    const newTotal = operand.fn(v1, v2);
    // console.log(`target=${target} ${operand.name} ${v1} ${v2} = ${newTotal}`);

    const newOps = [...ops, operand];
    if (newTotal === target && numbers.length === 2) {
      console.log(`SOLVED with ops=${newOps.map((op) => op.name)}`);
      return true;
    }

    if (numbers.length === 2) {
      continue;
    }

    if (canSolve(target, [newTotal, ...numbers.slice(2)], newOps)) {
      return true;
    }
  }

  return false;
};

for (const equation of equations) {
  // const pairs = arrayWindows(equation.numbers, 2);
  equation.canSolve = canSolve(equation.target, equation.numbers);
  console.log(equation.target, equation.numbers, equation.canSolve);
}

console.log(
  equations
    .filter((equation) => equation.canSolve === true)
    .reduce((acc, equation) => acc + equation.target, 0),
);
// console.dir(
//   equations.filter(
//     (equation) => equation.canSolve === true && equation.numbers.length < 5,
//   ),
//   { depth: null },
// );
// 6392014491321 too high
// 419 too low.
