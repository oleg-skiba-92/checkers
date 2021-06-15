import { IPlayer, ITurn } from '../../../models';
import { IUserEntity } from '../user/user.model';

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

export interface IRoomsCollection {
  readonly list: IRoomInfo[]

  getById(id: string): IRoomEntity;

  createRoom(users: IUserEntity[]): IRoomEntity;

  remove(id: string): void;
}
