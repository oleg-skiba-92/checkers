import { IPlayer, IUserEntity, UserEntity } from '../entities/user.entity';
import { socketService } from '../api-services/core';
import { ISocket } from '../models';

export interface IUsersCollection {

  readonly freePlayers: IPlayer[];

  create(id: string, userName: string, socket: ISocket): IUserEntity

  remove(id: string): void;

  getById(id: string): IUserEntity;

  getByIds(ids: string[]): IUserEntity[];

  removeSuggests(userId: string): void;
}

export class UsersCollection implements IUsersCollection {
  private users: IUserEntity[];

  get freePlayers(): IPlayer[] {
    return this.users.filter(user => !user.inGame).map(user => user.toPlayerData);
  }

  constructor() {
    this.users = [];
  }

  create(id: string, userName: string, socket: ISocket): IUserEntity {
    let user = this.getById(id);
    if (user) {
      return user;
    }
    user = new UserEntity(id, userName, socket);
    this.users.push(user);

    socketService.updateFreePlayerList();
  }

  getById(id: string): IUserEntity {
    return this.users.find((u) => u.id === id);
  }

  getByIds(ids: string[]): IUserEntity[] {
    return this.users.filter(user => ids.indexOf(user.id) !== -1);
  }

  remove(id: string): void {
    let userIdx = this.users.findIndex(u => u.id === id);

    if (userIdx === -1) {
      return;
    }

    this.users.splice(userIdx, 1);

    this.removeSuggests(id);

    socketService.updateFreePlayerList();
  }

  removeSuggests(userId: string) {
    this.users.forEach((user) => {
      user.removeSuggest(userId);
    });
  }
}

export const users: IUsersCollection = new UsersCollection();
