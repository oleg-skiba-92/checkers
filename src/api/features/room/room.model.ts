import { IPlayer, ITurn } from '../../../models';
import { IUserEntity } from '../user/user.model';
import { ICheckerCollection } from '../checker/checker.model';

export interface IRoomInfo {
  id: string;
  players: IPlayer[];
  checkers: string;
}


export interface IRoomEntity {
  id: string;
  checkers: ICheckerCollection;

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
