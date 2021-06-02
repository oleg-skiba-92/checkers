import { IPlayer, IRoomEntity, RoomEntity } from '../entities';
import { users } from './users.collection';
import { socketService } from '../api-services/core';
import { ITurn } from '../models';

export interface IRoomsCollection {
  getById(id: string): IRoomEntity;

  createRoom(userIds: string[]): void;

  endTurn(roomId: string, turns: ITurn[], user: IPlayer, isWin): void;

  userLeft(roomId: string, player: IPlayer);
  remove(id: string): void;
}

export class RoomsCollection implements IRoomsCollection {
  private rooms: IRoomEntity[];

  constructor() {
    this.rooms = [];
  }

  getById(id: string): IRoomEntity {
    return this.rooms.find((r) => r.id === id);
  }

  createRoom(userIds: string[]): void {
    let room = new RoomEntity(users.getByIds(userIds));
    this.rooms.push(room);

    room.newGame();

    socketService.updateFreePlayerList();
  }

  endTurn(roomId: string, turns: ITurn[], user: IPlayer, isWin: boolean): void {
    let room = this.getById(roomId);
    if (room) {
      socketService.endTurn(roomId, turns, user.id, user.color);
      if(isWin) {
        room.endGame();
        socketService.endGame(roomId, user);
        socketService.updateFreePlayerList();
        this.remove(roomId);
      }
    }
  }

  userLeft(roomId: string, player: IPlayer) {
    let room = this.getById(roomId);
    if (room) {
      socketService.userLeftRoom(roomId, player);
      room.endGame();
      this.remove(roomId)
    }
  }

  remove(id: string): void {
    let roomIdx = this.rooms.findIndex(r => r.id === id);

    if (roomIdx === -1) {
      return;
    }

    socketService.leveAllFromRoom(id);
    this.rooms.splice(roomIdx, 1);
  }
}

export const rooms: IRoomsCollection = new RoomsCollection()
