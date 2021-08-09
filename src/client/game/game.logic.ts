import { BoardLogic } from './board/board.logic';
import { Checker } from './checker/checker.logic';
import { EColor, EGameError, INextTurns, ITurn } from '../../models';
import { EVENTS, IGameScene } from './views.model';
import { IBoardLogic } from './board/board.model';
import { IChecker } from './checker/checker.model';
import { ICell } from './cell/cell.model';

export interface IGameLogic {
  newGame(checkers: string): void;

  outsideTurn(turns: ITurn[]);
}

export class GameLogic implements IGameLogic {
  board: IBoardLogic;

  checkers: IChecker[];
  history: string[];

  currentTurns: ITurn[];

  private _activeCell: string;

  get activeCell(): string {
    return this._activeCell;
  }

  set activeCell(value: string) {
    if (this._activeCell) {
      this.board.highlightOff([this.activeCell]);
    }

    if (value) {
      this.board.highlightAsActive(value);
    }

    this._activeCell = value;
  }

  get nextTurns(): INextTurns {
    return this.scene.game.nextTurns;
  }

  get possibleTurns(): ITurn[][] {
    let turns = this.nextTurns.beats.length ? this.nextTurns.beats : this.nextTurns.turns;

    return this.currentTurns.reduce((acc, curr, idx) => {
      return acc.filter(turn => turn[idx].turnPosition === curr.turnPosition);
    }, turns);
  }

  get currentTurnColor(): EColor {
    return this.nextTurns.color;
  }

  get playerColor(): EColor {
    return this.scene.game.userColor;
  }

  constructor(public scene: IGameScene) {
    this.board = new BoardLogic(scene);

    this.board.on(EVENTS.EMPTY_CELL_CLICKED, (cell: ICell) => {
      this.emptyCellClick(cell.boardPosition);
    });
  }

  newGame(checkers: string) {
    this._activeCell = null;
    this.history = [];
    this.currentTurns = [];

    this.board.initBoardView();

    this.checkers = [
      ...checkers.split(';')[1].split(',').map((boardPosition) => this.createChecker(EColor.Black, boardPosition)),
      ...checkers.split(';')[0].split(',').map((boardPosition) => this.createChecker(EColor.White, boardPosition))
    ];
  }

  checkerClick(checker: IChecker) {
    if (this.activeCell === checker.boardPosition) {
      this.clearError();
      this.currentTurns = [];
      this.activeCell = null;
      return;
    }

    const err = this.validateChecker(checker);
    if (err !== null) {
      this.showError(err);
      return;
    }

    this.activeCell = checker.boardPosition;
    this.currentTurns = [{turnPosition: checker.boardPosition, direction: null}];
    this.clearError();
  }

  emptyCellClick(boardPosition: string) {
    if (!this.activeCell) {
      this.clearError();
      return;
    }

    let idx = this.possibleTurns.findIndex(turn => turn[this.currentTurns.length] && turn[this.currentTurns.length].turnPosition === boardPosition);

    if (idx !== -1) {
      this.clearError();
      this.turn(this.activeCell, this.possibleTurns[idx][this.currentTurns.length]);
    } else {
      this.showError(EGameError.CannotTurnHere);
    }
  }

  turn(activePosition: string, turn: ITurn) {
    this.board.highlightOff([activePosition]);
    this.board.moveChecker(activePosition, turn.turnPosition);

    this.currentTurns.push(turn);

    if (turn.beatPosition) {
      this.activeCell = turn.turnPosition;
      let beatenChecker = this.checkers.find((checker) => checker.boardPosition === turn.beatPosition);
      beatenChecker.markAsBeaten();

      if (this.possibleTurns.length > 1 || (this.possibleTurns.length === 1 && (this.possibleTurns[0].length !== this.currentTurns.length))) {
        return;
      }
    }

    this.endTurn();
  }

  endTurn() {
    this.removeBeatenCheckers();
    this.activeCell = null;
    this.addHistory(this.currentTurns);
    this.scene.game.endTurn(this.currentTurns);
    this.currentTurns = [];
  }

  outsideTurn(turns: ITurn[]) {
    // TODO validate checkers (may history)
    this.clearError();
    for (let i = 1; i < turns.length; i++) {
      this.board.moveChecker(turns[i - 1].turnPosition, turns[i].turnPosition);

      if (turns[i].beatPosition) {
        this.removeChecker(turns[i].beatPosition);
      }
    }

    this.addHistory(turns);
  }

  removeBeatenCheckers() {
    this.currentTurns
      .filter((turn) => !!turn.beatPosition)
      .forEach((turn) => this.removeChecker(turn.beatPosition));
  }

  addHistory(turns: ITurn[]) {
    if (this.history.length) {
      let previousHistory = this.history[this.history.length - 1];
      this.board.highlightOff(previousHistory.split(previousHistory[2]));
    }

    let divider = !!turns[turns.length - 1].beatPosition ? ':' : '-';
    let positions = turns.map(t => t.turnPosition);

    this.history.push(positions.join(divider));
    this.board.highlightAsHistory(positions);

    console.log('history', this.history);
  }

  private removeChecker(position: string): void {
    let removeIdx = this.checkers.findIndex((checker) => checker.boardPosition === position);
    this.board.removeChecker(position);
    this.checkers[removeIdx].destroy();
    this.checkers.splice(removeIdx, 1);
  }

  private createChecker(color: EColor, boardPosition: string): IChecker {
    const checker = new Checker(this.scene, color, boardPosition);
    this.board.addChecker(checker);

    checker.onClick<IChecker>((c) => {
      this.checkerClick(c);
    });

    return checker;
  }

  private showError(error: EGameError): void {
    this.scene.game.showError(error);
  }

  private clearError(): void {
    this.scene.game.showError(null);
  }

  private validateChecker(checker: IChecker): EGameError {
    if (this.playerColor !== this.currentTurnColor) {
      return EGameError.OpponentTurn;
    }
    if (checker.color !== this.playerColor) {
      return EGameError.NotYourChecker;
    }

    if (this.currentTurns.length > 1) {
      return EGameError.NeedEndTurn;
    }

    if (this.nextTurns.beats.length && this.nextTurns.beats.findIndex((turn) => turn[0].turnPosition === checker.boardPosition) === -1) {
      return EGameError.BeatMandatory;
    }

    if ((this.nextTurns.beats.length ? this.nextTurns.beats : this.nextTurns.turns).findIndex((turn) => turn[0].turnPosition === checker.boardPosition) === -1) {
      return EGameError.CannotPossibleTurns;
    }

    return null;
  }
}
