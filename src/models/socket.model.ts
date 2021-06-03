import * as io from 'socket.io';
import { IncomingMessage } from 'http';

import { IRoomInfo, IPlayer } from '../api/entities';
import { EColor, ITurn } from './game.model';
import { IInitializedService, ISession } from './app.model';
import { ISuggest } from '../api/collections/suggest.collection';

export enum SocketEvents {
  SuggestList = 'list:suggest:update',
  FreePlayerList = 'list:freePlayer:update',
  RoomList = 'list:room:update',

  Suggest = 'suggestGame',
  AgreeSuggest = 'suggestGame:agree',
  DisagreeSuggest = 'suggestGame:disagree',
  TurnEnd = 'game:turn',
  GameStart = 'game:start',
  GameEnd = 'game:End',
  Disconnect = 'disconnect',
  UserLeftRoom = 'userLeftRoom',
}

export interface ISocket extends io.Socket {
  request: IncomingMessage & {session: ISession};
}
