// const WHITE_POSITIONS = ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2', 'a3', 'c3', 'e3', 'g3'];
// const BLACK_POSITIONS = ['b6', 'd6', 'f6', 'h6', 'a7', 'c7', 'e7', 'g7', 'b8', 'd8', 'f8', 'h8'];
export const WHITE_POSITIONS = ['00', '20', '40', '60', '11', '31', '51', '71', '02', '22', '42', '62'];
export const BLACK_POSITIONS = ['15', '35', '55', '75', '06', '26', '46', '66', '17', '37', '57', '77'];
import { EColor, EDirections, ITurn } from '../../../models';

// export const WHITE_POSITIONS = ['22', '42'];
// export const BLACK_POSITIONS = ['33', '35', '15', '11', '53', '55'];

export const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const CHECKER_DIRECTIONS = {
  [EColor.White]: [EDirections.LeftUp, EDirections.RightUp],
  [EColor.Black]: [EDirections.LeftDown, EDirections.RightDown],
  ALL: [EDirections.LeftDown, EDirections.RightDown, EDirections.LeftUp, EDirections.RightUp],
};

export interface ICheckerEntity {
  readonly isQueen: boolean;
  readonly position: string;
  readonly boardPosition: string;
  readonly color: EColor;
  readonly opponentColor: EColor;
  readonly directions: EDirections[];

  setAsQueen(): void;

  setPosition(position: string): void
}

export interface ICheckerCollection {
  readonly all: ICheckerEntity[];
  readonly whites: ICheckerEntity[];
  readonly blacks: ICheckerEntity[];
  readonly allPositions: string[];
  readonly whitePositions: string[];
  readonly blackPositions: string[];

  hasChecker(position: string, excludes?: string[], color?: EColor): boolean;

  getByPosition(position: string): ICheckerEntity;

  reset(): void;
}

export interface ICheckerLogic {
  calculateTurns(checkers: ICheckerCollection, checker: ICheckerEntity): ITurn[];

  calculateBeats(checkers: ICheckerCollection, checker: ICheckerEntity, previousTurns?: ITurn[]): ITurn[][];
}

export interface IBoard {
  getCells(position: string): { [key in EDirections]: string[] };

  getDirectionCells(position: string, direction: EDirections): string[];
}

export class Board implements IBoard {
  private _board: { [key in EDirections]: string[] }[][];

  constructor() {
    this._board = Array.from(Array(8), (v, i) => Array.from(Array(8), (v, j) => {
      if (((i + j) % 2) == 0) {
        return {
          [EDirections.RightUp]: this.getNextDiagonalPosition(`${i}${j}`, EDirections.RightUp),
          [EDirections.LeftUp]: this.getNextDiagonalPosition(`${i}${j}`, EDirections.LeftUp),
          [EDirections.RightDown]: this.getNextDiagonalPosition(`${i}${j}`, EDirections.RightDown),
          [EDirections.LeftDown]: this.getNextDiagonalPosition(`${i}${j}`, EDirections.LeftDown),
        };
      }

      return null;
    }));
  }

  getCells(position: string): { [key in EDirections]: string[] } {
    return this._board[position[0]][position[1]];
  }

  getDirectionCells(position: string, direction: EDirections): string[] {
    return this.getCells(position)[direction];
  }

  private getNextDiagonalPosition(position: string, direction: EDirections): string[] {
    let pos;
    switch (direction) {
      case EDirections.LeftDown:
        pos = (+position[0] - 1).toString() + (+position[1] - 1).toString();
        return position[0] === '0' || position[1] === '0' ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.LeftDown)];
      case EDirections.LeftUp:
        pos = (+position[0] - 1).toString() + (+position[1] + 1).toString();
        return position[0] === '0' || position[1] === '7' ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.LeftUp)];
      case EDirections.RightDown:
        pos = (+position[0] + 1).toString() + (+position[1] - 1).toString();
        return position[0] === '7' || position[1] === '0' ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.RightDown)];
      case EDirections.RightUp:
        pos = (+position[0] + 1).toString() + (+position[1] + 1).toString();
        return position[0] === '7' || position[1] === '7' ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.RightUp)];
    }
  }
}
