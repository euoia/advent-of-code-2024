module.exports = class Guard {
  constructor(board) {
    this.board = board;
    this.pathBoard = board.clone();
    this.cell = null;
    this.stepsTaken = 0;

    this.guardDirections = ["n", "e", "s", "w"];
    this.directionIdx = 0;

    this.resetPath();
  }

  get direction() {
    return this.guardDirections[
      this.directionIdx % this.guardDirections.length
    ];
  }

  get cellInFront() {
    return this.board.getCellInDirectionFromCell(
      this.cell.x,
      this.cell.y,
      this.direction,
    );
  }

  get canStepForward() {
    // Allow the guard to step out of bounds.
    return this.cellInFront === null || ['#', 'O'].includes(this.cellInFront.v) === false
  }

  stepForward() {
    this.pathBoard.setCellVal(this.cell.x, this.cell.y, (cell) =>
      cell.add(this.direction),
    );

    this.cell = this.cellInFront;
  }

  step() {
    if (this.canStepForward) {
      this.stepForward();
    } else {
      this.rotate();
    }

    this.stepsTaken += 1;
  }

  rotate() {
    this.directionIdx += 1;
  }

  clone() {
    const newGuard = new Guard(this.board);
    newGuard.directionIdx = this.directionIdx;
    newGuard.cell = this.cell;
    newGuard.board = this.board.clone();
    newGuard.pathBoard = this.pathBoard.clone();
    return newGuard;
  }

  get isInLoop() {
    if (this.cell === null) {
      return false;
    }

    return this.pathBoard
      .getCellVal(this.cell.x, this.cell.y)
      .has(this.direction);

  }

  resetPath() {
    this.pathBoard = this.board.clone();
    this.stepsTaken = 0;

    // Initialize the path board.
    this.pathBoard.getCells().forEach((cell) => {
      // Store the set of directions the guard has taken on each cell.
      // We can use this to determine if a loop is possible.
      cell.setVal(new Set());
    });
  }
};
