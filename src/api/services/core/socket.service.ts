import * as io from 'socket.io';

import { EColor, IPlayer, ITurn, SocketEvents } from '../../../models';
import { App } from '../../../../server';
import { Logger } from '../../libs';
import { ISuggest } from '../../features/suggest/suggest.model';
import { IRoomInfo } from '../../features/room/room.model';
import { GameCtrl } from '../../features/game/game.controller';
import { IInitializedService } from '../../models/app.model';
import { ISocket } from '../../models/socket.model';
import { IAuthData } from '../../features/auth/auth.model';

export class SocketService implements IInitializedService {
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
        return
      }

      socket.join('general')

      let socketUser = GameCtrl.userConnected(auth, socket.id);

      socket.on(SocketEvents.Suggest, (userId) => {
        this.log.info('Suggest', userId);
        GameCtrl.newSuggest(socketUser, userId);
      });

      socket.on(SocketEvents.AgreeSuggest, (userId) => {
        this.log.info('AgreeSuggest', userId);
        GameCtrl.agreeSuggest(socketUser, userId);
      })

      socket.on(SocketEvents.DisagreeSuggest, (userId) => {
        this.log.info('DisagreeSuggest', userId)
        GameCtrl.disagreeSuggest(socketUser, userId);
      })

      socket.on(SocketEvents.TurnEnd, (roomId, turns, isWin) => {
        this.log.info('TurnEnd', {roomId, turns, isWin})
        GameCtrl.turnEnd(socketUser, roomId, turns, isWin);
      })

      socket.on(SocketEvents.Disconnect, (reason) => {
        this.log.info('Disconnect', reason);
        GameCtrl.userDisconnected(socketUser);
      })
    });

    return true;
  }

  // TODO interfaces
  config(sessionMiddleware) {
    this.io.use((socket: ISocket, next: any) => {
      sessionMiddleware(socket.request, (<any>socket.request).res, next);
    });
  }

  updateSuggestList(suggests: ISuggest[]): void {
    this.io.to('general').emit(SocketEvents.SuggestList, suggests);
  }

  updateFreePlayerList(freePlayers: IPlayer[]): void {
    this.io.in('general').emit(SocketEvents.FreePlayerList, freePlayers);
  }

  updateRoomList(rooms: IRoomInfo[]): void {
    this.io.in('general').emit(SocketEvents.RoomList, rooms);
  }



  startGame(room: IRoomInfo): void {
    this.io.to(room.id).emit(SocketEvents.GameStart, room)
  }

  joinToRooms(socketIds: string[], roomId: string): void {
    socketIds.forEach((socketId) => {
      this.io.sockets.sockets.get(socketId).join(roomId);
    })
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

export const socketService = new SocketService()
