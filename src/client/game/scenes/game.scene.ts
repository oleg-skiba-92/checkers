import { IPoint } from '../models';
import { IGame } from '../game';

export const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const NUMBERS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export interface IGameScene extends Phaser.Scene {
  isRevers: boolean;
  boardMargin: number;
  cellSize: number;
  letters: string[];
  numbers: string[];

  boardPositionToPosition(boardPosition: string): IPoint;
}

export class GameScene extends Phaser.Scene implements IGameScene {
  boardMargin: number = 30;
  cellSize: number = 60;
  isRevers = false;

  game: IGame;

  get letters(): string[] {
    if (this.isRevers) {
      return [...LETTERS].reverse();
    } else {
      return [...LETTERS]
    }
  }

  get numbers(): string[] {
    if (this.isRevers) {
      return [...NUMBERS].reverse();
    } else {
      return [...NUMBERS]
    }
  }

  constructor() {
    super({key: 'Game'});

    this.boardMargin = 30;
    this.cellSize = 60;
    this.isRevers = false;
  }

  public preload(): void {
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json');
    this.load.image({key: 'board', url: 'assets/board.png'});
  }

  public create() {
    this.add.image(0, 0, 'board').setOrigin(0, 0);
    this.input.mouse.disableContextMenu();


    this.game.initGameLogic(this);
  }

  boardPositionToPosition(boardPosition: string): IPoint {
    return {
      x: this.letters.indexOf(boardPosition[0]) * this.cellSize + this.boardMargin,
      y: this.numbers.indexOf(boardPosition[1]) * this.cellSize + this.boardMargin
    }
  }
}
