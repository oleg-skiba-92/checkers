import { IRoomEntity, IRoomInfo, IRoomsCollection } from './room.model';
import { IUserEntity } from '../user/user.model';
import { RoomEntity } from './room.entity';

export class RoomsCollection implements IRoomsCollection {
  private _rooms: IRoomEntity[];

  get list(): IRoomInfo[] {
    return this._rooms.map((room) => room.info);
  }

  constructor() {
    this._rooms = [];
  }

  getById(id: string): IRoomEntity {
    return this._rooms.find((r) => r.id === id);
  }

  createRoom(users: IUserEntity[]): IRoomEntity {
    let room = new RoomEntity(users);
    this._rooms.push(room);
    return room;
  }

  remove(id: string): void {
    let roomIdx = this._rooms.findIndex(r => r.id === id);

    if (roomIdx !== -1) {
      this._rooms.splice(roomIdx, 1);
    }
  }
}
