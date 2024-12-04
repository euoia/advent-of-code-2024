module.exports = class Board {
  // Create a board.
  constructor(boardInput) {
    this.width = boardInput[0].length;
    this.height = 0;
    this.cells = [];

    for (const yIdx in boardInput) {
      const row = boardInput[yIdx];
      if (row.length !== this.width) {
        throw new Error("All rows must be the same width.");
      }

      const rowCells = [];
      for (const xIdx in row) {
        rowCells.push(row[xIdx]);
      }

      this.cells.push(rowCells);

      this.height += 1;
    }

    this.compassOffsets = {
      w: [-1, 0],
      nw: [-1, -1],
      n: [0, -1],
      ne: [1, -1],
      e: [1, 0],
      se: [1, 1],
      s: [0, 1],
      sw: [-1, 1],
    };

    this.compassDirs = Object.keys(this.compassOffsets);
  }

  toString() {
    return this.cells.map((row) => row.join("")).join("\n");
  }

  // Get a cell at a specific position.
  // x: The x index (relative to the left).
  // t: The y index (relative to the top).
  get(x, y) {
    return this.cells[x]?.[y] ?? null;
  }

  // Get an array of cells, starting at x and y in a specific direction and of
  // a specific length.
  getCompassCellsInDirectionFromCell(x, y, dir, length) {
    const cells = [];

    const [offsetX, offsetY] = this.compassOffsets[dir];
    for (let distance = 0; distance < length; distance++) {
      cells.push(this.get(x + offsetX * distance, y + offsetY * distance));
    }

    return cells;
  }

  getOffsetsOfLength(dir, length, options = {}) {
    const centered = options.centered ?? false;

    const [offsetX, offsetY] = this.compassOffsets[dir];
    const offsets = [];
    const centerOffset = centered ? (length - 1) / 2 : 0;
    for (let distance = 0; distance < length; distance++) {
      offsets.push([
        offsetX * (distance - centerOffset),
        offsetY * (distance - centerOffset),
      ]);
    }

    return offsets;
  }

  // Get an array of cells, centered around a specific cell.
  getDiagonalsAroundCell(x, y, length) {
    const totalLength = length * 2 + 1;

    const neCells = this.getOffsetsOfLength("ne", totalLength, {centered: true}).map(
      ([offsetX, offsetY]) => this.getCellVal(x + offsetX, y + offsetY),
    );
    const seCells = this.getOffsetsOfLength("se", totalLength, {centered: true}).map(
      ([offsetX, offsetY]) => this.getCellVal(x + offsetX, y + offsetY),
    );

    return [neCells, seCells];
  }

  // Return an object containing strings starting from cell with a given length.
  // Returns an object with the following keys: w, nw, n, ne, e, se, s, sw.
  getAllCompassCellsInDirectionFromCell(x, y, length) {
    return Object.fromEntries(
      this.compassDirs.map((dir) => {
        return [
          dir,
          this.getCompassCellsInDirectionFromCell(x, y, dir, length),
        ];
      }),
    );
  }

  getCellVal(xIdx, yIdx) {
    return this.cells[yIdx]?.[xIdx] ?? null;
  }

  *getCells() {
    for (let yIdx = 0; yIdx < this.height; yIdx++) {
      for (let xIdx = 0; xIdx < this.width; xIdx++) {
        yield {
          x: xIdx,
          y: yIdx,
          v: this.cells[yIdx][xIdx],
        };
      }
    }
  }
};
