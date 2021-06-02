import { IPlayer, IUserEntity } from './user.entity';
import { EColor } from '../models';
import { socketService } from '../api-services/core';

export interface IRoomInfo {
  id: string;
  players: IPlayer[];
}


export interface IRoomEntity {
  id: string;

  readonly info: IRoomInfo;

  newGame(): void;

  endGame(): void;
}

export class RoomEntity implements IRoomEntity {
  id: string;

  get info(): IRoomInfo {
    return {
      id: this.id,
      players: this.users.map(u => u.toPlayerData),
    }
  }

  constructor(private users: IUserEntity[]) {
    this.id = this.generateId();
  }

  newGame(): void {
    let randIdx = Math.floor(Math.random() * 2)
    this.users[randIdx].startGame(this.id, EColor.White);
    this.users[+(!randIdx)].startGame(this.id, EColor.Black);
    socketService.startGame(this.info);
  }

  endGame() {
    this.users[0].endGame();
    this.users[1].endGame();
  }

  private generateId(): string {
    const len = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randString = '';
    for (let i = 0, n = charset.length; i < len; ++i) {
      randString += charset.charAt(Math.floor(Math.random() * n));
    }
    return randString;
  }
}
