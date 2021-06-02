import { GameScene, IGameScene } from './scenes';
import { GameLogic, IGameLogic } from './logic';
import { IRoom } from '../../models/room.model';
import { SocketService, UiService } from '../services';
import { EColor, ITurn } from '../../models';

const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  width: 540,
  height: 540,
  type: Phaser.AUTO,
  parent: 'game',
  disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0}
    }
  }
};

export interface IGame extends Phaser.Game {
  initGameLogic(scene: IGameScene): void;
}

export class Game extends Phaser.Game implements IGame {
  gameLogic: IGameLogic;
  room: IRoom;

  constructor(
    public socketService: SocketService,
    public uiService: UiService
  ) {
    super({...GAME_CONFIG, ...{scene: [GameScene]}});
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
    this.gameLogic.onEndTurn((turns: ITurn[], isWin: boolean) => {
      this.socketService.turnEnd(turns, this.room.id, isWin);
    });

    this.gameLogic.onError((error) => {
      this.uiService.showError(error);
    })
  }
}
