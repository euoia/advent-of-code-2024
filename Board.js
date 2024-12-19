const { cloneDeep } = require("lodash");

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

  initialize(width, height, val) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () =>
      Array.from({ length: width }),
    );

    for (let yIdx = 0; yIdx < height; yIdx++) {
      for (let xIdx = 0; xIdx < width; xIdx++) {
        let newVal = val;
        if (typeof val === "function") {
          newVal = val();
        }

        this.cells[yIdx][xIdx] = newVal;
      }
    }
  }

  toString() {
    return this.cells.map((row) => row.join("")).join("\n");
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

    const neCells = this.getOffsetsOfLength("ne", totalLength, {
      centered: true,
    }).map(([offsetX, offsetY]) => this.getCellVal(x + offsetX, y + offsetY));
    const seCells = this.getOffsetsOfLength("se", totalLength, {
      centered: true,
    }).map(([offsetX, offsetY]) => this.getCellVal(x + offsetX, y + offsetY));

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

  getCellInDirectionFromCell(x, y, dir) {
    if (Object.keys(this.compassOffsets).includes(dir) === false) {
      throw new Error(`Invalid direction: ${dir}`);
    }

    const [offsetX, offsetY] = this.compassOffsets[dir];
    return this.get(x + offsetX, y + offsetY);
  }

  getCellVal(xIdx, yIdx) {
    return this.cells[yIdx]?.[xIdx] ?? null;
  }

  setCellVal(xIdx, yIdx, val) {
    console.warn(`setCellVal is deprecated. Use set instead.`);
    this.set(xIdx, yIdx, val);
  }

  checkBounds(xIdx, yIdx) {
    if (xIdx < 0 || xIdx >= this.width || yIdx < 0 || yIdx >= this.height) {
      throw new Error(`Index out of bounds: ${xIdx}, ${yIdx}`);
    }
  }

  set(xIdx, yIdx, val) {
    this.checkBounds(xIdx, yIdx);

    if (typeof val === "function") {
      val = val(this.cells[yIdx][xIdx]);
    }

    this.cells[yIdx][xIdx] = val;
  }

  cellLocationsAreEqual(cell1, cell2) {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  getCell(x, y) {
    console.warn(`getCell is deprecated. Use get instead.`);
    return this.get(x, y);
  }

  get(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }

    const board = this;

    return {
      x,
      y,
      get v() {
        return board.cells[y][x];
      },
      setVal: (val) => {
        board.set(x, y, val);
      },
      toString: () => {
        return `x=${x} y=${y} v=${this.cells[y][x]}`;
      },
      hasSameLocation: (cell) => cell.x === x && cell.y === y,
      getAdjacentCell(dir) {
        return board.getCellInDirectionFromCell(x, y, dir);
      },
    };
  }

  *getCells() {
    for (let yIdx = 0; yIdx < this.height; yIdx++) {
      for (let xIdx = 0; xIdx < this.width; xIdx++) {
        yield this.get(xIdx, yIdx);
      }
    }
  }

  clone() {
    const newBoard = new Board([[]]);
    newBoard.cells = cloneDeep(this.cells);
    newBoard.width = this.width;
    newBoard.height = this.height;
    return newBoard;
  }

  *getRows() {
    for (let yIdx = 0; yIdx < this.height; yIdx++) {
      const row = [];
      for (let xIdx = 0; xIdx < this.width; xIdx++) {
        row.push(this.get(xIdx, yIdx));
      }
      yield row;
    }
  }

  setAllCellValues(val) {
    for (const cell of this.getCells()) {
      cell.setVal(val);
    }
  }

  draw(drawFn = (v) => v.toString()) {
    let str = "";
    str = `+` + "-".repeat(this.width) + `+\n`;

    for (const row of this.getRows()) {
      let rowStr = "";
      for (const cell of row) {
        rowStr += drawFn(cell);
      }

      str += `|` + rowStr + `|` + "\n";
    }

    str += `+` + "-".repeat(this.width) + `+`;

    console.log(str);
  }
};
