import { IPlayer } from './user.model';

export interface IRoomInfo {
  id: string;
  players: IPlayer[];
  checkers: string;
}
