import { IUserEntity, IUsersCollection } from './user.model';
import { IPlayer } from '../../../models';
import { UserEntity } from './user.entity';

export class UsersCollection implements IUsersCollection {
  private _users: IUserEntity[];

  get freePlayers(): IPlayer[] {
    return this._users.filter(user => !user.inGame).map(user => user.playerData);
  }

  constructor() {
    this._users = [];
  }

  create(id: string, userName: string, socketId: string): IUserEntity {
    let user = this.getById(id);
    if (user) {
      user.socketId = socketId;
      return user;
    }

    user = new UserEntity(id, userName, socketId);

    this._users.push(user);

    return user;
  }

  getById(id: string): IUserEntity {
    return this._users.find((u) => u.id === id);
  }

  getByIds(ids: string[]): IUserEntity[] {
    return this._users.filter(user => ids.indexOf(user.id) !== -1);
  }

  getPlayersByIds(ids: string[]): IPlayer[] {
    return this.getByIds(ids).map((user) => user.playerData);
  }

  remove(id: string): void {
    let userIdx = this._users.findIndex(u => u.id === id);

    if (userIdx !== -1) {
      this._users.splice(userIdx, 1);
    }
  }
}
