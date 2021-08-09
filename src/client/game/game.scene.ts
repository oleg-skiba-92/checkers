import { IGame } from './game';
import { IGameScene, IPoint } from './views.model';
import { EColor } from '../../models';

export const CELLS = ['0', '1', '2', '3', '4', '5', '6', '7'];

export class GameScene extends Phaser.Scene implements IGameScene {
  boardMargin: number = 30;
  cellSize: number = 60;

  game: IGame;

  get isRevers(): boolean {
    return this.game.userColor !== null ? this.game.userColor === EColor.Black : false;
  }

  get letters(): string[] {
    if (this.isRevers) {
      return [...CELLS].reverse();
    } else {
      return [...CELLS];
    }
  }

  get numbers(): string[] {
    if (this.isRevers) {
      return [...CELLS];
    } else {
      return [...CELLS].reverse();
    }
  }

  constructor() {
    super({key: 'Game'});

    this.boardMargin = 30;
    this.cellSize = 60;
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
    };
  }
}
