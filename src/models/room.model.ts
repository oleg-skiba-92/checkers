import { EColor } from './game.model';

export interface IRoom {
  id: string;
  isPlaying: boolean;
  players: IRoomPlayer[];
  checkers: string;
}

export interface IRoomPlayer {
  id: string;
  userName: string;
  color: EColor;
}
