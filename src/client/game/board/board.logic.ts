import { Cell } from '../cell/cell.logic';
import { BoardView } from './board.view';
import { IBoardLogic } from './board.model';
import { EVENTS, IGameScene } from '../views.model';
import { ICell } from '../cell/cell.model';
import { IChecker } from '../checker/checker.model';

export class BoardLogic extends BoardView implements IBoardLogic {
  cells: { [key: string]: ICell }

  constructor(scene: IGameScene) {
    super(scene);

    this.cells = {};
  }

  initBoardView() {
    this.initLegend();

    Object.keys(this.cells).forEach((key) => {
      this.cells[key].destroy();
    })

    this.cells = {};

    this.scene.letters.forEach((l) => {
      this.scene.numbers.forEach((n) => {
        this.cells[l + n] = new Cell(this.scene, l + n);

        this.cells[l + n].onClick<ICell>((cell) => {
          if (cell.isEmpty) {
            this.emit(EVENTS.EMPTY_CELL_CLICKED, cell);
          }
        })
      })
    })
  }

  addChecker(checker: IChecker) {
    this.cells[checker.boardPosition].checker = checker;
  }

  moveChecker(oldPos: string, newPos: string) {
    this.cells[oldPos].checker.moveToBoardPosition(newPos);
    this.cells[newPos].checker = this.cells[oldPos].checker;
    this.cells[oldPos].checker = null;
  }

  removeChecker(position: string) {
    this.cells[position].checker = null;
  }

  isEmptyCell(boardPosition: string): boolean {
    return this.cells[boardPosition].isEmpty;
  }

  highlightAsActive(boardPosition: string): void {
    this.cells[boardPosition].highlightAsActive();
  }

  highlightAsHistory(boardPositions: string[]): void {
    boardPositions.forEach(boardPosition => this.cells[boardPosition].highlightAsHistory())
  }

  highlightOff(boardPositions: string[]): void {
    boardPositions.forEach(boardPosition => this.cells[boardPosition].highlightOff())
  }

  getCells(boardPositions: string[]): ICell[] {
    return boardPositions.map(boardPosition => this.cells[boardPosition])
  }
}
