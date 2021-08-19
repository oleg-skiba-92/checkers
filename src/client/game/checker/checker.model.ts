import { EColor, TSimpleDataCallback } from '../../../models';
import { IGameScene } from '../game.model';

export interface ICheckerView extends Phaser.GameObjects.Container {
  scene: IGameScene;

  onClick<T extends ICheckerView>(fn: TSimpleDataCallback<T>): void;
}

export interface IChecker extends ICheckerView {
  color: EColor;
  boardPosition: string;
  isQueen: boolean;
  isBeaten: boolean;

  moveToBoardPosition(boardPosition: string): void;

  markAsBeaten(): void;
}
