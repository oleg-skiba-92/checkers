import { BoardLogic } from './board/board.logic';
import { Checker } from './checker/checker.logic';
import { EColor, EGameError, ITurn } from '../../models';
import { IPossibleTurnLogic, PossibleTurnLogic } from './logic/turn.logic';
import { EVENTS, IGameScene, TSimpleDataCallback } from './views.model';
import { IBoardLogic } from './board/board.model';
import { IChecker } from './checker/checker.model';
import { ICell } from './cell/cell.model';

const WHITE_POSITIONS = ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2', 'a3', 'c3', 'e3', 'g3'];
const BLACK_POSITIONS = ['b6', 'd6', 'f6', 'h6', 'a7', 'c7', 'e7', 'g7', 'b8', 'd8', 'f8', 'h8'];

// const BLACK_POSITIONS = ['c7', 'e5', 'g5', 'c5'];

export interface IGameLogic {
  onEndTurn(cb: (turns: ITurn[], isWin: boolean) => void): void;

  onError(cb: TSimpleDataCallback<EGameError>): void;

  newGame(playerColor: EColor): void;

  outsideTurn(turns: ITurn[]);
}

export class GameLogic implements IGameLogic {
  board: IBoardLogic;
  possibleTurnLogic: IPossibleTurnLogic;

  checkers: IChecker[];

  currentTurnColor: EColor;
  playerColor: EColor;
  history: string[];

  possibleTurns: ITurn[];
  currentTurns: ITurn[];

  _endTurnCb: (turns: ITurn[], isWin: boolean) => void;
  _showErrorCb: TSimpleDataCallback<EGameError>;

  private _activeCell: string;

  get activeChecker(): IChecker {
    return this.checkers.find(checker => checker.boardPosition === this.activeCell)
  }

  get activeCell(): string {
    return this._activeCell
  }

  set activeCell(value: string) {
    if (this._activeCell) {
      this.board.highlightOff([this.activeCell]);
    }

    if (value) {
      this.board.highlightAsActive(value);
    }

    if (!value) {
      this.possibleTurns = [];
    }

    this._activeCell = value;
  }

  constructor(public scene: IGameScene) {
    this.board = new BoardLogic(scene);

    this._endTurnCb = () => {}
    this._showErrorCb = () => {}

    this.board.on(EVENTS.EMPTY_CELL_CLICKED, (cell: ICell) => {
      this.emptyCellClick(cell.boardPosition);
    });
  }

  onEndTurn(cb: (turns: ITurn[], isWin: boolean) => void) {
    if (typeof cb === 'function') {
      this._endTurnCb = cb
    } else {
      this._endTurnCb = () => {}
    }
  }

  onError(cb: TSimpleDataCallback<EGameError>) {
    if (typeof cb === 'function') {
      this._showErrorCb = cb
    } else {
      this._showErrorCb = () => {}
    }
  }

  newGame(playerColor: EColor) {
    this._activeCell = null;
    this.currentTurnColor = EColor.White;
    this.playerColor = playerColor;
    this.history = [];
    this.possibleTurns = [];
    this.currentTurns = null;

    this.scene.isRevers = this.playerColor === EColor.Black;
    this.possibleTurnLogic = new PossibleTurnLogic(this.board, this.scene.letters, this.scene.numbers);


    this.board.initBoardView();

    this.checkers = [
      ...BLACK_POSITIONS.map((boardPosition) => {
        const checker = new Checker(this.scene, EColor.Black, boardPosition);
        this.board.addChecker(checker);
        return checker;
      }),
      ...WHITE_POSITIONS.map((boardPosition) => {
        const checker = new Checker(this.scene, EColor.White, boardPosition);
        this.board.addChecker(checker);
        return checker;
      })
    ]

    this.checkers.forEach((checker) => {
      checker.onClick<IChecker>((c) => {
        this.checkerClick(c)
      })
    })

    this.checkers.filter((c) => c.color === this.currentTurnColor).forEach((c: any) => {
      c.calculatePossibleTurns(this.possibleTurnLogic)
    });
  }

  checkerClick(checker: IChecker) {
    if (this.playerColor !== this.currentTurnColor) {
      this._showErrorCb(EGameError.OpponentTurn);
      return;
    }
    if (checker.color !== this.playerColor) {
      this._showErrorCb(EGameError.NotYourChecker);
      return;
    }

    if (this.currentTurns !== null) {
      this._showErrorCb(EGameError.NeedEndTurn);
      return;
    }

    let turns = this.checkers.filter((c) => c.color === this.currentTurnColor)
      .reduce((a, c) => {return [...a, {pos: c.boardPosition, turns: [...c.possibleTurns]}]}, <{pos: string, turns: ITurn[]}[]>[]);

    let beats = turns.filter(t => t.turns.filter(t2 => !!t2.beatPosition).length)

    if(beats.length && beats.findIndex(t => t.pos === checker.boardPosition) === -1) {
      this._showErrorCb(EGameError.BeatMandatory);
      return;
    }

    if (this.activeCell === checker.boardPosition) {
      this._showErrorCb(null);
      this.activeCell = null;
      return;
    }


    this.possibleTurns = this.possibleTurnLogic.calculate(checker);
    console.log('this.possibleTurns', this.possibleTurns);

    if (this.possibleTurns.length) {
      this.activeCell = checker.boardPosition;
      this._showErrorCb(null);
    } else {
      this._showErrorCb(EGameError.CannotPossibleTurns);
    }
  }

  emptyCellClick(boardPosition: string) {
    if (!this.activeCell) {
      this._showErrorCb(null);
      return;
    }

    let idx = this.possibleTurns.findIndex((p) => p.turnPosition === boardPosition)
    if (idx !== -1) {
      this._showErrorCb(null);
      this.turn(this.activeCell, this.possibleTurns[idx]);
    } else {
      this._showErrorCb(EGameError.CannotTurnHere);
    }
  }

  turn(activePosition: string, turn: ITurn) {
    this.board.highlightOff([activePosition]);
    this.board.moveChecker(activePosition, turn.turnPosition);

    this.currentTurns = this.currentTurns || [{turnPosition: activePosition, direction: null}];
    this.currentTurns.push(turn);

    if (turn.beatPosition) {
      this.activeCell = turn.turnPosition;
      let beatenChecker = this.checkers.find((checker) => checker.boardPosition === turn.beatPosition)
      beatenChecker.markAsBeaten();

      this.possibleTurns = this.possibleTurnLogic.nextBeats(this.activeChecker, turn.direction);
      if (this.possibleTurns.length) {
        return;
      }
    }

    this.endTurn();
  }

  endTurn() {
    this.removeBeatenCheckers();
    this.activeCell = null;
    this.addHistory(this.currentTurns);
    this._endTurnCb(this.currentTurns, this.checkWin());
    this.changeCurrentColor();
    this.currentTurns = null;
  }

  outsideTurn(turns: ITurn[]) {
    this._showErrorCb(null);
    for (let i = 1; i < turns.length; i++) {
      this.board.moveChecker(turns[i - 1].turnPosition, turns[i].turnPosition);

      if (turns[i].beatPosition) {
        this.removeChecker(turns[i].beatPosition);
      }
    }

    this.changeCurrentColor();
    this.addHistory(turns);

    this.checkers.filter((c) => c.color === this.currentTurnColor).forEach((c: any) => {
      c.calculatePossibleTurns(this.possibleTurnLogic)
    })

  }

  removeBeatenCheckers() {
    this.currentTurns
      .filter((turn) => !!turn.beatPosition)
      .forEach((turn) => this.removeChecker(turn.beatPosition));
  }

  addHistory(turns: ITurn[]) {
    if (this.history.length) {
      let previousHistory = this.history[this.history.length - 1]
      this.board.highlightOff(previousHistory.split(previousHistory[2]))
    }

    let divider = !!turns[turns.length - 1].beatPosition ? ':' : '-'
    let positions = turns.map(t => t.turnPosition);

    this.history.push(positions.join(divider));
    this.board.highlightAsHistory(positions);

    console.log('history', this.history);
  }

  private checkWin(): boolean {
    return this.checkers.filter((checker) => checker.color !== this.currentTurnColor).length === 0
  }

  private removeChecker(position: string): void {
    let removeIdx = this.checkers.findIndex((checker) => checker.boardPosition === position);
    this.board.removeChecker(position);
    this.checkers[removeIdx].destroy();
    this.checkers.splice(removeIdx, 1);
  }

  private changeCurrentColor() {
    this.currentTurnColor = this.currentTurnColor === EColor.White ? EColor.Black : EColor.White;
  }

}
