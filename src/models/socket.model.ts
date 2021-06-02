import * as io from 'socket.io';
import { IncomingMessage } from 'http';

import { IRoomInfo, IPlayer } from '../entities';
import { EColor, ITurn } from './game.model';
import { IInitializedService, ISession } from './app.model';

export enum SocketEvents {
  Suggest = 'suggestGame',
  AgreeSuggest = 'suggestGame:agree',
  DisagreeSuggest = 'suggestGame:disagree',
  SuggestListUpdate = 'suggest:update',
  TurnEnd = 'game:turn',
  FreePlayersUpdate = 'list:update',
  GameStart = 'game:start',
  GameEnd = 'game:End',
  Disconnect = 'disconnect',
  UserLeftRoom = 'userLeftRoom',
}

export interface ISocketService extends IInitializedService {
  // TODO interfaces
  config(sessionMiddleware): void;

  updateSuggest(socketId: string, suggests: IPlayer[]): void;

  updateFreePlayerList(): void;

  startGame(room: IRoomInfo): void

  joinToRoom(socketId: string, roomId: string): void;

  endTurn(roomId: string, turns: ITurn[], userId: string, color: EColor): void;

  endGame(roomId: string, player:IPlayer): void;

  userLeftRoom(roomId: string, player:IPlayer): void;

  leveAllFromRoom(roomId: string): void;
}

export interface ISocket extends io.Socket {
  request: IncomingMessage & {session: ISession};
}
