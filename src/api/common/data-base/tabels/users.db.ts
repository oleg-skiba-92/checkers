import { EDataEntity, EDBFunctions, IDataTable } from '../../../models/db.model';

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
  ],
  triggers: [
    {name: `${EDBFunctions.AppendNumberGuest}_trigger`, onType: 'BEFORE', event: 'INSERT', fnName: EDBFunctions.AppendNumberGuest},
    {name: `${EDBFunctions.CreateRating}_trigger`, onType: 'AFTER', event: 'INSERT', fnName: EDBFunctions.CreateRating},
  ],
};
