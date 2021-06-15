import { EColor } from './game.model';

export interface IUserInfo {
  id: string;
  userName: string;
  picture?: string;
  rating?: number;
  email?: string;
  dateCreated?: string;
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
  picture?: string;
  rating?: number;
}
