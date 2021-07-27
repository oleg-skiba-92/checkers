import 'phaser';

import { EColor, EGameError, INextTurns, IRoom, IUserTurn } from '../../models';
import { ITurn } from '../../models';
import { IGameScene, TSimpleDataCallback } from './views.model';
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
  nextTurns: INextTurns;
  readonly userColor: EColor

  initGameLogic(scene: IGameScene): void;

  showError(err: EGameError): void;

  endTurn(turn: ITurn[]): void;
}

export interface IClientGame {
  afterLoad(fn: () => void): void;

  newGame(room: IRoom): void;

  onError(fn: TSimpleDataCallback<EGameError>): void;

  onEndTurn(fn: TSimpleDataCallback<ITurn[]>): void;

  setNextTurns(nextTurns: INextTurns): void;

  outsideTurn(userTurn: IUserTurn): void;
}

export class Game extends Phaser.Game implements IGame, IClientGame {
  nextTurns: INextTurns;

  get userColor(): EColor {
    return !!this.room ? this.room.players.find(p => p.id === this.userId).color : null;
  }

  private gameLogic: IGameLogic;
  private room: IRoom;
  private userId: string;
  private isLoaded: boolean;
  private _onAfterLoad: () => void;
  private _onError: TSimpleDataCallback<EGameError>;
  private _onEndTurn: TSimpleDataCallback<ITurn[]>;

  constructor(userId: string) {
    super({...GAME_CONFIG, ...{scene: [GameScene]}});
    this.isLoaded = false;
    this.userId = userId;

    this._onError = () => {};
    this._onEndTurn = () => {};
  }

  newGame(room: IRoom) {
    this.room = room;
    this.gameLogic.newGame(room.checkers);
  }

  outsideTurn(userTurn: IUserTurn): void {
    if (this.userId === userTurn.userId) {
      return;
    }

    this.gameLogic.outsideTurn(userTurn.turns);
  }

  setNextTurns(nextTurns: INextTurns): void {
    this.nextTurns = nextTurns;
  }

  initGameLogic(scene: IGameScene): void {
    this.gameLogic = new GameLogic(scene);

    this.isLoaded = false;
    if (typeof this._onAfterLoad === 'function') {
      this._onAfterLoad();
    }
  }

  afterLoad(fn: () => void): void {
    if (typeof fn !== 'function') {
      return;
    }

    if (this.isLoaded) {
      fn();
      return;
    }

    this._onAfterLoad = fn;
  }

  showError(err: EGameError): void {
    this._onError(err);
  }

  endTurn(turn: ITurn[]): void {
    this._onEndTurn(turn);
  }

  onError(fn: TSimpleDataCallback<EGameError>): void {
    if (typeof fn === 'function') {
      this._onError = fn;
    } else {
      this._onError = () => {};
    }
  }

  onEndTurn(fn: TSimpleDataCallback<ITurn[]>): void {
    if (typeof fn === 'function') {
      this._onEndTurn = fn;
    } else {
      this._onEndTurn = () => {};
    }
  }
}
