import { IPlayer, IUserEntity } from './user.entity';
import { EColor, ITurn } from '../../models';
import { v4 as uuidv4 } from 'uuid';

export interface IRoomInfo {
  id: string;
  players: IPlayer[];
}


export interface IRoomEntity {
  id: string;

  readonly info: IRoomInfo;

  newGame(): void;

  endGame(): void;

  endTurn(turns: ITurn[]): void;
}

export class RoomEntity implements IRoomEntity {
  id: string;

  get info(): IRoomInfo {
    return {
      id: this.id,
      players: this.users.map(u => u.playerData),
    }
  }

  constructor(private users: IUserEntity[]) {
    this.id = uuidv4();
  }

  newGame(): void {
    let randIdx = Math.floor(Math.random() * 2)
    this.users[randIdx].startGame(this.id, EColor.White);
    this.users[+(!randIdx)].startGame(this.id, EColor.Black);
  }

  endGame(): void {
    this.users[0].endGame();
    this.users[1].endGame();
  }

  // TODO
  endTurn(turns: ITurn[]): void {

  }
}
