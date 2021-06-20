import { EDataEntity } from '../../models/db.model';
import { IUserInfo } from '../../../models';


export enum EGuestsColumns {
  ID = 'id',
  UserName = 'user_name',
  DateCreated = 'date_created',
  LastVisited = 'last_visited',
  CountNumber = 'count_number'
}

export const GUEST_DATA_TABLE = {
  name: EDataEntity.Guests,
  cols: [
    {name: EGuestsColumns.ID, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: EGuestsColumns.UserName, type: 'VARCHAR(50)', keys: []},
    {name: EGuestsColumns.DateCreated, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EGuestsColumns.LastVisited, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EGuestsColumns.CountNumber, type: 'SERIAL', keys: ['NOT NULL', 'UNIQUE']},
  ]
};

export interface IGuestTable {
  id: string;
  user_name: string;
  date_created?: string;
  last_visited?: string;
  count_number?: string;
}

export interface IGuestDataService {
  getById(id: string): Promise<IGuestTable>;

  create(data: IGuestTable): Promise<IGuestTable>;

  updateLastVisited(id: string): Promise<void>;

  toUserInfo(guest: IGuestTable): IUserInfo;

}
