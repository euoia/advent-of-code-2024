const { parseArgvFile, awaitUserInput } = require("../utils");
const Board = require("../Board");
const { Permutation } = require("js-combinatorics");

const input = parseArgvFile("");
const board = new Board(input);

const antinodes = board.clone();

const antennas = board.getCells().reduce((acc, cell) => {
  if (cell.v === ".") {
    return acc;
  }

  if (acc.has(cell.v)) {
    acc.get(cell.v).push(cell);
  } else {
    acc.set(cell.v, [cell]);
  }

  return acc;
}, new Map());

const placeAntinodes = async () => {

  for await (const [antenna, cells] of antennas) {
    console.log(`Antenna ${antenna} has ${cells.length} cells.`);

    const pairs = new Permutation(cells, 2);

    for await (const [cell1, cell2] of pairs) {
      antinodes.getCell(cell1.x, cell1.y).setVal("#");
      antinodes.getCell(cell2.x, cell2.y).setVal("#");

      const xDistance = cell1.x - cell2.x;
      const yDistance = cell1.y - cell2.y;

      let xPos = cell1.x;
      let yPos = cell1.y;

      while (antinodes.getCellVal(xPos, yPos) !== null) {
        antinodes.setCellVal(xPos, yPos, "#");
        xPos += xDistance;
        yPos += yDistance;
      }

      xPos = cell1.x;
      yPos = cell1.y;

      while (antinodes.getCellVal(xPos, yPos) !== null) {
        antinodes.setCellVal(xPos, yPos, "#");
        xPos -= xDistance;
        yPos -= yDistance;
      }
    };
  };
};

const main = async () => {
  await placeAntinodes();
  antinodes.draw();
  console.log(
    [...antinodes.getCells()].filter((cell) => cell.v === "#").length,
  );
};

main().then(() => process.exit(0));
