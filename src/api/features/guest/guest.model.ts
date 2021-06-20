import { EDataEntity } from '../../models/db.model';


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
