import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { SocketEvents } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';

export class SocketService {
  public socket: Socket;

  private get baseUrl(): string {
    return BASE_SERVER_URL;
  }

  connect(token: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl, {auth: {token: token}});

    this.socket
      .on('connect', () => {
        console.log('connect');
      })
      .on('disconnect', (...args) => {
        console.log('disconnect');
      })
      .on(SocketEvents.Error, (error) => {
        // TODO handling error;
        console.log('SocketEvents.Error', error);
      });
  }

  emit(event: SocketEvents, ...args) {
    this.socket.emit(event, ...args);
  }

  subscribe(event: SocketEvents, fn: (...args) => void) {
    this.socket.on(event, fn);
  }
}

export const socketService = new SocketService();
