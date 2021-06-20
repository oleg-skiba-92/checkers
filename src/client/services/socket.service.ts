import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { EColor, ITurn, SocketEvents } from '../../models';

export class SocketService {
  public socket: Socket;

  private get baseUrl(): string {
    return 'http://localhost:3000';
  }

  connect() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl);
    this.socket.on('connect', () => {
      console.log('connect');
    });


    this.socket.on('disconnect', (...args) => {
      console.log('disconnect');
    });
  }

  sendSuggest(userId: string) {
    this.socket.emit(SocketEvents.Suggest, userId);
  }

  agreeSuggest(userId: string) {
    this.socket.emit(SocketEvents.AgreeSuggest, userId);
  }

  disagreeSuggest(userId: string) {
    this.socket.emit(SocketEvents.DisagreeSuggest, userId);
  }

  turnEnd(turns: ITurn[], roomId: string, isWin: boolean) {
    this.socket.emit(SocketEvents.TurnEnd, roomId, turns, isWin)
  }

  gameEnd(roomId: string) {
    this.socket.emit(SocketEvents.GameEnd, roomId)
  }
}

export const socketService = new SocketService();
