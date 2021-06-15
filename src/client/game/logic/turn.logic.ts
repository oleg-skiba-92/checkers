import { EColor, EDirections, ITurn } from '../../../models';
import { ICell } from '../cell/cell.model';
import { IChecker } from '../checker/checker.model';
import { IBoardLogic } from '../board/board.model';

interface IDiagonalCells {
  ru: ICell[];
  lu: ICell[];
  rd: ICell[];
  ld: ICell[];
}

export interface IPossibleTurnLogic {
  calculate(checker: IChecker): ITurn[];

  nextBeats(checker: IChecker, previousDirection: EDirections): ITurn[];
}

export class PossibleTurnLogic implements IPossibleTurnLogic {
  constructor(private board: IBoardLogic, private letters: string[], private numbers: string[]) {}

  calculate(checker: IChecker): ITurn[] {
    let diagonalCells = this.getNextDiagonalCells(checker.boardPosition);
    let possibleTurns = this.canBeats(diagonalCells, checker.color, checker.isQueen);

    if (possibleTurns.length) {
      return possibleTurns;
    }

    return this.canTurns(diagonalCells, checker.isQueen);
  }

  nextBeats(checker: IChecker, previousDirection: EDirections): ITurn[] {
    let diagonalCells = this.getNextDiagonalCells(checker.boardPosition);


    return this.canBeats(diagonalCells, checker.color, checker.isQueen, this.reverseDirection(previousDirection));
  }

  private getNextDiagonalCells(boardPosition: string): IDiagonalCells {
    return {
      ru: this.board.getCells(this.getNextDiagonalPosition(boardPosition, EDirections.RightUp)),
      rd: this.board.getCells(this.getNextDiagonalPosition(boardPosition, EDirections.RightDown)),
      lu: this.board.getCells(this.getNextDiagonalPosition(boardPosition, EDirections.LeftUp)),
      ld: this.board.getCells(this.getNextDiagonalPosition(boardPosition, EDirections.LeftDown))
    }
  }

  private getNextDiagonalPosition(boardPosition: string, direction: EDirections): string[] {
    let li = this.letters.indexOf(boardPosition[0]);
    let ni = this.numbers.indexOf(boardPosition[1]);
    let pos;
    switch (direction) {
      case EDirections.LeftDown:
        pos = this.letters[li - 1] + this.numbers[ni + 1];
        return li === 0 || ni === 7 ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.LeftDown)];
      case EDirections.LeftUp:
        pos = this.letters[li - 1] + this.numbers[ni - 1];
        return li === 0 || ni === 0 ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.LeftUp)];
      case EDirections.RightDown:
        pos = this.letters[li + 1] + this.numbers[ni + 1];
        return li === 7 || ni === 7 ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.RightDown)];
      case EDirections.RightUp:
        pos = this.letters[li + 1] + this.numbers[ni - 1];
        return li === 7 || ni === 0 ? [] : [pos, ...this.getNextDiagonalPosition(pos, EDirections.RightUp)];
    }
  }

  private canBeats(diagonalCells: IDiagonalCells, color: EColor, isQueen: boolean, excludeDirection: EDirections = null): ITurn[] {
    return [
      ...(excludeDirection === EDirections.RightUp ? [] : this.canBeat(diagonalCells.ru, color, isQueen, EDirections.RightUp)),
      ...(excludeDirection === EDirections.RightDown ? [] : this.canBeat(diagonalCells.rd, color, isQueen, EDirections.RightDown)),
      ...(excludeDirection === EDirections.LeftUp ? [] : this.canBeat(diagonalCells.lu, color, isQueen, EDirections.LeftUp)),
      ...(excludeDirection === EDirections.LeftDown ? [] : this.canBeat(diagonalCells.ld, color, isQueen, EDirections.LeftDown)),
    ]
  }

  private canBeat(cells: ICell[], color: EColor, isQueen: boolean, direction: EDirections): ITurn[] {
    let arr: ITurn[] = [];
    let stopIdx = isQueen ? cells.length : 2;

    if (cells.length < 2) {
      return arr;
    }

    let beatIdx = cells.findIndex(cell => cell.isChecker && cell.checker.color !== color && !cell.checker.isBeaten);

    if (beatIdx === -1) {
      return arr;
    }

    let idx = beatIdx + 1;

    while (idx < stopIdx && cells[idx].isEmpty) {
      arr.push({
        beatPosition: cells[beatIdx].boardPosition,
        turnPosition: cells[idx].boardPosition,
        direction
      });
      idx++;
    }

    return arr;
  }

  private canTurns(diagonalCells: IDiagonalCells, isQueen: boolean): ITurn[] {
    return [
      ...this.canTurn(diagonalCells.ru, isQueen, EDirections.RightUp),
      ...this.canTurn(diagonalCells.lu, isQueen, EDirections.LeftUp),
      ...(isQueen ? this.canTurn(diagonalCells.rd, isQueen, EDirections.RightDown) : []),
      ...(isQueen ? this.canTurn(diagonalCells.ld, isQueen, EDirections.LeftDown) : []),
    ]
  }

  private canTurn(cells: ICell[], isQueen: boolean, direction: EDirections): ITurn[] {
    let arr: ITurn[] = [];
    let stopIdx = isQueen ? cells.length : 1;

    if (!cells.length) {
      return arr;
    }

    let idx = 0;

    while (idx < stopIdx && cells[idx].isEmpty) {
      arr.push({
        turnPosition: cells[idx].boardPosition,
        direction
      });
      idx++;
    }

    return arr;
  }

  private reverseDirection(direction: EDirections): EDirections {
    switch (direction) {
      case EDirections.LeftDown:
        return EDirections.RightUp
      case EDirections.LeftUp:
        return EDirections.RightDown
      case EDirections.RightDown:
        return EDirections.LeftUp
      case EDirections.RightUp:
        return EDirections.LeftDown
    }
  }
}
