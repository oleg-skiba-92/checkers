import { CheckerView } from './checker.view';
import { EColor } from '../../../models';
import { IGameScene } from '../views.model';
import { IChecker } from './checker.model';

export class Checker extends CheckerView implements IChecker {
  color: EColor;
  boardPosition: string;
  isQueen: boolean;
  isBeaten: boolean;

  constructor(scene: IGameScene, color: EColor, boardPosition: string) {
    super(scene, color, scene.boardPositionToPosition(boardPosition));

    this.color = color
    this.boardPosition = boardPosition;
    this.isQueen = false;
    this.isBeaten = false;
  }

  moveToBoardPosition(boardPosition: string): void {
    this.boardPosition = boardPosition;
    this.move(this.scene.boardPositionToPosition(boardPosition));

    if (this.color === EColor.White && boardPosition[1] === '7'
      || this.color === EColor.Black && boardPosition[1] === '0') {
      this.setAsQueen();

      // TODO: setAsQueen after animation end
    }
  }

  markAsBeaten() {
    this.isBeaten = true;
    this.setAlpha(0.5);
  }

  private setAsQueen(): void {
    this.isQueen = true;
    this.showQueen();
  }
}
