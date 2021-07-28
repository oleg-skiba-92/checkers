import * as io from 'socket.io';

import { INextTurns, IPlayer, IUserTurn, SocketEvents } from '../../../models';
import { App } from '../../../../server';
import { Logger } from '../../libs';
import { IInvite } from '../../features/invite/invite.model';
import { IRoomInfo } from '../../features/room/room.model';
import { GameCtrl } from '../../features/game/game.controller';
import { IInitializedService } from '../../models/app.model';
import { ISocket } from '../../models/socket.model';
import { IAuthData } from '../../features/auth/auth.model';
import { UserCtrl } from '../../features/user/user.controller';

export class SocketService implements IInitializedService {
  private io: io.Server;
  private log = new Logger('SOCKET');

  constructor() {}

  async initialise(server: App): Promise<boolean> {
    this.io = new io.Server(server.http, {
      cors: {
        // TODO: find another way
        origin: 'http://localhost:3001',
        credentials: true
      }
    });

    this.io.on('connection', (socket: ISocket) => {
      this.log.info('Connect');

      let auth: IAuthData = socket.request.session && socket.request.session.auth;

      if (!auth) {
        this.log.error('unauthorised user');
        socket.disconnect(true);
        return;
      }

      socket.join('general');

      let socketUser = GameCtrl.userConnected(auth, socket.id);

      socket.on(SocketEvents.Invite, (userId) => {
        this.log.info('Invite', userId);
        GameCtrl.newInvite(socketUser, userId);
      });

      socket.on(SocketEvents.AgreeInvite, (userId) => {
        this.log.info('AgreeInvite', userId);
        GameCtrl.agreeInvite(socketUser, userId);
      });

      socket.on(SocketEvents.DisagreeInvite, (userId) => {
        this.log.info('DisagreeInvite', userId);
        GameCtrl.disagreeInvite(socketUser, userId);
      });

      socket.on(SocketEvents.TurnEnd, (roomId, turns) => {
        this.log.info('TurnEnd', {roomId, turns});
        GameCtrl.turnEnd(socketUser, roomId, turns);
      });

      socket.on(SocketEvents.Disconnect, (reason) => {
        this.log.info('Disconnect', reason);
        GameCtrl.userDisconnected(socketUser);
        UserCtrl.userDisconnected(auth);
      });
    });

    return true;
  }

  // TODO interfaces
  config(sessionMiddleware) {
    this.io.use((socket: ISocket, next: any) => {
      sessionMiddleware(socket.request, (<any>socket.request).res, next);
    });
  }

  updateInviteList(invites: IInvite[]): void {
    this.io.to('general').emit(SocketEvents.InviteList, invites);
  }

  updateFreePlayerList(freePlayers: IPlayer[]): void {
    this.io.in('general').emit(SocketEvents.FreePlayerList, freePlayers);
  }

  updateRoomList(rooms: IRoomInfo[]): void {
    this.io.in('general').emit(SocketEvents.RoomList, rooms);
  }

  startGame(room: IRoomInfo, nextTurns: INextTurns): void {
    this.io.to(room.id).emit(SocketEvents.GameStart, room, nextTurns);
  }

  joinToRooms(socketIds: string[], roomId: string): void {
    socketIds.forEach((socketId) => {
      this.io.sockets.sockets.get(socketId).join(roomId);
    });
  }

  endTurn(roomId: string, userTurn: IUserTurn, nextTurns: INextTurns): void {
    this.io.to(roomId).emit(SocketEvents.TurnEnd, userTurn, nextTurns);
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

export const socketService = new SocketService();
