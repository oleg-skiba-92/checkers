import { EColor, TSimpleDataCallback } from '../../../models';
import { IChecker } from '../checker/checker.model';
import { IGameScene } from '../game.model';

export interface ICellView extends Phaser.GameObjects.Container {
  scene: IGameScene;

  onClick<T extends ICellView>(fn: TSimpleDataCallback<T>): void;

  highlightOff(): void;
}

export enum ECellState {
  NoneUsable,
  Empty
}

export interface ICell extends ICellView {
  readonly isEmpty: boolean;
  color: EColor;
  boardPosition: string;
  status: ECellState;
  checker: IChecker;
  isChecker: boolean;

  highlightAsActive(): void;

  highlightAsHistory(): void;
}
