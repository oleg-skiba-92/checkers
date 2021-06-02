import * as io from 'socket.io';

import { EColor, IAuthData, ISocket, ISocketService, ITurn, SocketEvents } from '../../../models';
import { App } from '../../../../server';
import { users } from '../../collections';
import { IRoomInfo, IPlayer } from '../../entities';
import { Logger } from '../../libs/logger';

export class SocketService implements ISocketService {
  private io: io.Server;
  private log = new Logger('SOCKET')

  constructor() {}

  async initialise(server: App): Promise<boolean> {
    this.io = new io.Server(server.http, {
      cors: {origin: '*',}
    });

    this.io.on('connection', (socket: ISocket) => {

      let auth: IAuthData = socket.request.session && socket.request.session.auth

      if (!auth) {
        this.log.error('unauthorised user')
        socket.disconnect(true);
      }

      socket.join('general')

      users.create(auth.userId.toString(), auth.userName, socket);
    });

    return true;
  }

  // TODO interfaces
  config(sessionMiddleware) {
    this.io.use((socket: ISocket, next: any) => {
      sessionMiddleware(socket.request, (<any>socket.request).res, next);
    });
  }

  updateSuggest(socketId: string, suggests: IPlayer[]): void {
    this.io.to(socketId).emit(SocketEvents.SuggestListUpdate, suggests);
  }

  updateFreePlayerList(): void {
    this.io.in('general').emit(SocketEvents.FreePlayersUpdate, users.freePlayers);
  }

  startGame(room: IRoomInfo): void {
    this.io.to(room.id).emit(SocketEvents.GameStart, room)
  }

  joinToRoom(socketId: string, roomId: string): void {
    this.io.sockets.sockets.get(socketId).join(roomId);
  }

  endTurn(roomId: string, turns: ITurn[], userId: string, color: EColor): void {
    this.io.to(roomId).emit(SocketEvents.TurnEnd, turns, userId, color)
  }

  endGame(roomId: string, player: IPlayer): void {
    this.io.to(roomId).emit(SocketEvents.GameEnd, player);
  }

  userLeftRoom(roomId: string, player: IPlayer) {
    this.io.to(roomId).emit(SocketEvents.UserLeftRoom, player);
  }

  leveAllFromRoom(roomId: string) {
    this.io.to(roomId).socketsLeave(roomId);
  }
}

export const socketService: ISocketService = new SocketService()
