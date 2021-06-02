import { EColor, ISocket, SocketEvents } from '../models';
import { ILogger, Logger } from '../libs/logger';
import { rooms, users } from '../collections';
import { socketService } from '../api-services/core';

export interface IPlayer {
  id: string;
  userName: string;
  color?: EColor;
}

export interface IUserEntity {
  id: string;
  userName: string;
  socketId: string;
  roomId: string;
  inGame: boolean;
  suggests: IPlayer[];
  color: EColor;
  readonly toPlayerData: IPlayer;

  addSuggest(suggestUser: IPlayer): void;

  removeSuggest(userId: string): void;

  startGame(roomId: string, color: EColor): void;

  endGame(): void;
}

export class UserEntity implements IUserEntity {
  suggests: IPlayer[];
  socketId: string;

  inGame: boolean;
  color: EColor;
  roomId: string;

  private log: ILogger;

  get toPlayerData(): IPlayer {
    return {id: this.id, userName: this.userName, color: this.color};
  }

  constructor(
    public id: string,
    public userName: string,
    socket: ISocket,
  ) {
    this.log = new Logger(`UserEntity ${id} - ${userName}`)

    this.socketId = socket.id;
    this.initSocketEvents(socket);

    this.suggests = [];
    this.inGame = false;
    this.color = null;
  }

  addSuggest(suggestUser: IPlayer): void {
    if (this.suggests.findIndex((u) => u.id === suggestUser.id) === -1) {
      this.suggests.push(suggestUser);

      socketService.updateSuggest(this.socketId, this.suggests);
    }
  }

  // TODO: array of user ids
  removeSuggest(userId: string): void {
    let idx = this.suggests.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.suggests.splice(idx, 1);

      socketService.updateSuggest(this.socketId, this.suggests);
    }
  }

  startGame(roomId: string, color: EColor): void {
    socketService.joinToRoom(this.socketId, roomId);
    this.color = color;
    this.inGame = true;
    this.roomId = roomId;
  }

  endGame(): void {
    this.color = null;
    this.inGame = false;
  }

  private initSocketEvents(socket: ISocket) {
    socket.on(SocketEvents.Suggest, (userId) => {
      this.log.info('SocketEvents.Suggest', userId)

      let user: IUserEntity = users.getById(userId);
      if (user) {
        user.addSuggest(this.toPlayerData);
      }
    });

    socket.on(SocketEvents.AgreeSuggest, (userId) => {
      this.log.info('SocketEvents.AgreeSuggest', userId)

      users.removeSuggests(userId);
      users.removeSuggests(this.id);
      rooms.createRoom([this.id, userId]);
    })

    socket.on(SocketEvents.DisagreeSuggest, (userId) => {
      this.log.info('SocketEvents.DisagreeSuggest', userId)
      this.removeSuggest(userId);
    })

    socket.on(SocketEvents.TurnEnd, (roomId, turns, isWin) => {
      this.log.info('SocketEvents.TurnEnd', {roomId, turns, isWin})
      rooms.endTurn(roomId, turns, this.toPlayerData, isWin);
    })

    socket.on(SocketEvents.Disconnect, (reason) => {
      this.log.info('SocketEvents.Disconnect', reason);

      if(this.roomId) {
        rooms.userLeft(this.roomId, this.toPlayerData)
      }

      users.remove(this.id);
    })
  }
}
