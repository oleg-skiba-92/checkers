import { Board, CHECKER_DIRECTIONS, IBoard, ICheckerCollection, ICheckerEntity, ICheckerLogic } from './checker.model';
import { EDirections, ITurn } from '../../../models';

export class CheckerLogic implements ICheckerLogic {
  private board: IBoard;

  constructor() {
    this.board = new Board();
  }

  calculateTurns(checkers: ICheckerCollection, checker: ICheckerEntity) {
    return checker.directions
      .map((direction) => this.calculateTurn(checkers, checker, direction))
      .reduce((acc, cur) => [...acc, ...cur], []);
  }

  calculateBeats(checkers: ICheckerCollection, checker: ICheckerEntity, previousTurns: ITurn[] = []) {
    return CHECKER_DIRECTIONS.ALL
      .map((direction) => this.calculateBeat(checkers, checker, direction, previousTurns))
      .reduce((acc, cur) => [...acc, ...cur], []);
  }

  private calculateTurn(checkers: ICheckerCollection, checker: ICheckerEntity, direction: EDirections): ITurn[] {
    let positions = this.board.getDirectionCells(checker.position, direction);

    let arr: ITurn[] = [];
    let stopIdx = checker.isQueen ? positions.length : 1;

    if (!positions.length) {
      return arr;
    }

    let idx = 0;

    while (idx < stopIdx && !checkers.hasChecker(positions[idx])) {
      arr.push({
        turnPosition: positions[idx],
        direction
      });
      idx++;
    }

    return arr;
  }

  private calculateBeat(checkers: ICheckerCollection, checker: ICheckerEntity, direction: EDirections, previousTurns: ITurn[]) {
    let position = previousTurns.length ? previousTurns[previousTurns.length - 1].turnPosition : checker.position;
    let previousDirection = previousTurns.length ? previousTurns[previousTurns.length - 1].direction : null;
    let excludePositions = [checker.position, ...previousTurns.map(turn => turn.beatPosition)];
    let cells = this.board.getDirectionCells(position, direction);
    let turns: ITurn[][] = [];
    let stopIdx = checker.isQueen ? cells.length : 2;

    if (previousTurns.length && this.reverseDirection(previousDirection) === direction) {
      return turns;
    }

    if (cells.length < 2) {
      return turns;
    }

    let beatIdx = cells.findIndex((position) => checkers.hasChecker(position, excludePositions, checker.opponentColor));

    if (beatIdx === -1) {
      return turns;
    }

    let idx = beatIdx + 1;

    while (idx < stopIdx && !checkers.hasChecker(cells[idx], excludePositions)) {
      let turn = {
        beatPosition: cells[beatIdx],
        turnPosition: cells[idx],
        direction
      };
      let nextBeats = this.calculateBeats(checkers, checker, [...previousTurns, {...turn}]);

      if (nextBeats.length) {
        nextBeats.forEach((nextBeat) => turns.push([{...turn}, ...nextBeat]));
      } else {
        turns.push([{...turn}]);
      }
      idx++;
    }
    let maxLength = Math.max(...turns.map((turn) => turn.length));

    return turns
      .filter((turn) => !!maxLength && maxLength > 1 ? turn.length !== 1 : true);

  }

  private reverseDirection(direction: EDirections): EDirections {
    switch (direction) {
      case EDirections.LeftDown:
        return EDirections.RightUp;
      case EDirections.LeftUp:
        return EDirections.RightDown;
      case EDirections.RightDown:
        return EDirections.LeftUp;
      case EDirections.RightUp:
        return EDirections.LeftDown;
    }
  }

}

export const checkerLogic = new CheckerLogic();
