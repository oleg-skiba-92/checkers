import 'phaser';

import { IRoom } from '../../models';
import { ITurn } from '../../models';
import { IGameScene } from './views.model';
import { GameLogic, IGameLogic } from './game.logic';
import { GameScene } from './game.scene';

const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  width: 540,
  height: 540,
  type: Phaser.AUTO,
  disableContextMenu: false,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0}
    }
  }
};

export interface IGame extends Phaser.Game {
  initGameLogic(scene: IGameScene): void;

  afterLoad(fn: () => void): void;
}

export class Game extends Phaser.Game implements IGame {
  gameLogic: IGameLogic;
  room: IRoom;

  private isLoaded: boolean;
  private _onAfterLoad: () => void;

  constructor() {
    super({...GAME_CONFIG, ...{scene: [GameScene]}});
    this.isLoaded = false;
  }

  newGame(room: IRoom, currentUserId: string) {
    this.room = room;
    this.gameLogic.newGame(room.players.find(p => p.id === currentUserId).color);
  }

  updateBoard(turns: ITurn[]) {
    this.gameLogic.outsideTurn(turns);
  }

  // todo implement endTurn and showError (without callbacks)

  initGameLogic(scene: IGameScene) {
    this.gameLogic = new GameLogic(scene);

    this.isLoaded = false;
    if (typeof this._onAfterLoad === 'function') {
      this._onAfterLoad();
    }

    this.gameLogic.onEndTurn((turns: ITurn[]) => {
      // this.socketService.turnEnd(turns, this.room.id, isWin);
    });

    this.gameLogic.onError((error) => {
      console.log('onError', error);
    });
  }

  afterLoad(fn: () => void) {
    if (typeof fn !== 'function') {
      return;
    }

    if (this.isLoaded) {
      fn();
      return;
    }

    this._onAfterLoad = fn;
  }
}
