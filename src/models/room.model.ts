import { EColor } from './game.model';

export interface IRoom {
  id: string;
  isPlaying: boolean;
  players: IRoomPlayer[]
}

export interface IRoomPlayer {
  id: string;
  userName: string;
  color: EColor;
}
