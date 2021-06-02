import { CheckerView } from '../views/checker.view';
import { EColor, ITurn } from '../../../models';
import { IGameScene } from '../scenes/game.scene';
import { IChecker } from '../models';

export class Checker extends CheckerView implements IChecker {
  color: EColor;
  boardPosition: string;
  isQueen: boolean;
  isBeaten: boolean;
  possibleTurns: ITurn[]

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

    if (this.color === EColor.White && boardPosition[1] === '8'
      || this.color === EColor.Black && boardPosition[1] === '1') {
      this.setAsQueen();

      // TODO: setAsQueen after animation end
    }
  }

  markAsBeaten() {
    this.isBeaten = true;
    this.setAlpha(0.5);
  }

  calculatePossibleTurns(possibleTurnLogic) {
    this.possibleTurns = possibleTurnLogic.calculate(this);
  }

  private setAsQueen(): void {
    this.isQueen = true;
    this.showQueen();
  }
}
