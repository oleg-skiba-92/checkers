//#region enums
import { IGame } from './game';

export enum EVENTS {
  EMPTY_CELL_CLICKED = 'EMPTY_CELL_CLICKED'
}

//#endregion enums

//#region types
export type TSimpleCallback = () => void;
export type TSimpleDataCallback<T> = (data: T) => void;
//#endregion types

//#region interfaces
export interface ISize {
  w: number;
  h: number;
}

export interface IPoint {
  x: number;
  y: number;
}

//#endregion interfaces
export interface IGameScene extends Phaser.Scene {
  readonly isRevers: boolean;
  boardMargin: number;
  cellSize: number;
  letters: string[];
  numbers: string[];

  game: IGame;

  boardPositionToPosition(boardPosition: string): IPoint;
}
