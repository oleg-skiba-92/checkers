import { EColor } from '../../../models';
import { CellView } from './cell.view';
import { ECellState, ICell } from './cell.model';
import { IChecker } from '../checker/checker.model';
import { IGameScene } from '../game.model';

export class Cell extends CellView implements ICell {
  color: EColor;
  boardPosition: string;
  status: ECellState;
  checker: IChecker;

  get isEmpty() {
    return !this.checker;
  }

  get isChecker() {
    return !!this.checker;
  }

  constructor(scene: IGameScene, boardPosition: string) {
    const color = (scene.letters.indexOf(boardPosition[0]) + scene.numbers.indexOf(boardPosition[1])) % 2
      ? EColor.Black
      : EColor.White;

    super(scene, color, scene.boardPositionToPosition(boardPosition));

    this.color = color;
    this.boardPosition = boardPosition;
    this.status = this.color === EColor.Black ? ECellState.Empty : ECellState.NoneUsable;
  }

  // isChecker(color: EColor) {
  //   switch (color) {
  //     case EColor.White:
  //       return this.status === ECellState.WhiteChecker;
  //     case EColor.Black:
  //       return this.status === ECellState.BlackChecker;
  //     default:
  //       return false;
  //   }
  // }

  highlightAsActive() {
    this.highlightOn(0x5ac914);
  }

  highlightAsHistory() {
    this.highlightOn(0xc91414);
  }
}
