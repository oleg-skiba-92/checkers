import { EColor, IPlayer } from '../../../models';

export interface IUserInfo {
  id: string;
  userName: string;
  email: string;
  dateCreated: string;
}

export interface IUserTable {
  id: string;
  email: string;
  google_id?: string;
  user_name?: string;
  password?: string;
  date_created?: string;
}

export interface IUserEntity {
  id: string;
  userName: string;
  socketId: string;
  roomId: string;
  inGame: boolean;
  color: EColor;
  readonly playerData: IPlayer;

  startGame(roomId: string, color: EColor): void;

  endGame(): void;
}

export interface IUsersCollection {

  readonly freePlayers: IPlayer[];

  create(id: string, userName: string, socketId: string): IUserEntity;

  getById(id: string): IUserEntity;

  getByIds(ids: string[]): IUserEntity[];

  getPlayersByIds(ids: string[]): IPlayer[];

  remove(id: string): void
}

export interface IUserDataService {
  getByGoogleId(id: string): Promise<IUserTable>;

  getById(id: string): Promise<IUserTable>;

  getByEmail(email: string): Promise<IUserTable>;

  updatePassword(id: string, passwordHash: string): Promise<void>;

  updateGoogleId(id: string, googleId: string): Promise<void>;

  createUser(data: IUserTable): Promise<IUserTable>;

  toUserInfo(user: IUserTable): IUserInfo;
}
