import { EColor, IPlayer, IUserInfo } from '../../../models';
import { EDataEntity, IDataTable } from '../../models/db.model';

export enum EUsersColumns {
  ID = 'id',
  GoogleId = 'google_id',
  UserName = 'user_name',
  Password = 'password',
  DateCreated = 'date_created',
  LastVisited = 'last_visited',
  Email = 'email',
  Picture = 'picture',
}

export const USER_DATA_TABLE: IDataTable = {
  name: EDataEntity.Users,
  cols: [
    {name: EUsersColumns.ID, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: EUsersColumns.GoogleId, type: 'VARCHAR(50)', keys: ['UNIQUE']},
    {name: EUsersColumns.UserName, type: 'VARCHAR(50)', keys: []},
    {name: EUsersColumns.Email, type: 'VARCHAR(200)', keys: ['UNIQUE']},
    {name: EUsersColumns.Picture, type: 'VARCHAR(200)', keys: []},
    {name: EUsersColumns.Password, type: 'VARCHAR(60)', keys: []},
    {name: EUsersColumns.DateCreated, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EUsersColumns.LastVisited, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
  ]
};

export interface IUserTable {
  id: string;
  email: string;
  google_id?: string;
  user_name?: string;
  password?: string;
  date_created?: string;
  last_visited?: string;
  picture?: string;
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
