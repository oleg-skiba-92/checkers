import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { ITurn, SocketEvents } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';

export class SocketService {
  public socket: Socket;

  private get baseUrl(): string {
    return BASE_SERVER_URL;
  }

  connect() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl, {withCredentials: true});
    this.socket.on('connect', () => {
      console.log('connect');
    });


    this.socket.on('disconnect', (...args) => {
      console.log('disconnect');
    });
  }

  sendInvite(userId: string) {
    this.socket.emit(SocketEvents.Invite, userId);
  }

  agreeInvite(userId: string) {
    this.socket.emit(SocketEvents.AgreeInvite, userId);
  }

  disagreeInvite(userId: string) {
    this.socket.emit(SocketEvents.DisagreeInvite, userId);
  }

  turnEnd(turns: ITurn[], roomId: string) {
    this.socket.emit(SocketEvents.TurnEnd, roomId, turns);
  }

  gameEnd(roomId: string) {
    this.socket.emit(SocketEvents.GameEnd, roomId);
  }
}

export const socketService = new SocketService();
