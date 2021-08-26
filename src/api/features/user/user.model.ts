import { EColor, IPlayer, IUserInfo } from '../../../models';
import { EDataEntity, IDataTable } from '../../models/db.model';

export enum EUsersColumns {
  ID = 'id',
  UserName = 'user_name',
  DateCreated = 'date_created',
  LastVisited = 'last_visited',
  Picture = 'picture',
  isGuest = 'is_guest',
}

export const USER_TABLE: IDataTable = {
  name: EDataEntity.Users,
  cols: [
    {name: EUsersColumns.ID, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: EUsersColumns.UserName, type: 'VARCHAR(50)', keys: []},
    {name: EUsersColumns.Picture, type: 'VARCHAR(500)', keys: []},
    {name: EUsersColumns.DateCreated, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EUsersColumns.LastVisited, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EUsersColumns.isGuest, type: 'BOOLEAN', keys: ['DEFAULT false']},
  ]
};

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
