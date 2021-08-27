import { EColor, IPlayer, IUserInfo } from '../../../models';

export interface IUserTable {
  id: string;
  user_name: string;
  is_guest: boolean;
  picture: string;
  date_created?: string;
  last_visited?: string;
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

  remove(id: string): void;
}

export interface IUserDataService {
  getById(id: string): Promise<IUserTable>;

  createUser(data: IUserTable): Promise<IUserTable>;

  updateLastVisited(id: string): Promise<void>;

  toUserInfo(user: IUserTable): IUserInfo;
}
