import { IGame } from './game';

export enum EVENTS {
  EMPTY_CELL_CLICKED = 'EMPTY_CELL_CLICKED'
}

//#region interfaces
export interface ISize {
  w: number;
  h: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameScene extends Phaser.Scene {
  readonly isRevers: boolean;
  boardMargin: number;
  cellSize: number;
  letters: string[];
  numbers: string[];

  game: IGame;

  boardPositionToPosition(boardPosition: string): IPoint;
}
//#endregion interfaces
