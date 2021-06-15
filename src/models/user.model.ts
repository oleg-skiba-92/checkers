import { EColor } from './game.model';

export interface IUser {
  id: string;
  userName: string;
}

export interface IRegistrationRequest {
  userName: string;
  password: string;
  email: string;
}

export interface ILoginRequest {
  password: string;
  email: string;
}

export interface IPlayer {
  id: string;
  userName: string;
  color?: EColor;
}
