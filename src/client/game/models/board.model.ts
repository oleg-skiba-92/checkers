import { IGameScene } from '../scenes';
import { ICell } from './cell.model';

export interface IBoardView extends Phaser.GameObjects.Container {
  scene: IGameScene;
}

export interface IBoardLogic extends IBoardView {
  initBoardView(): void;

  addChecker(checker): void;

  isEmptyCell(boardPosition: string): boolean;

  highlightAsActive(boardPosition: string): void;

  highlightAsHistory(boardPositions: string[]): void;

  highlightOff(boardPositions: string[]): void;

  getCells(boardPositions: string[]): ICell[];

  moveChecker(oldPos: string, newPos: string): void;

  removeChecker(position: string): void;
}
