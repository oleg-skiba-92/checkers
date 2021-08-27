import { EDataEntity, IDataTable } from '../../../models/db.model';

export enum EAuthColumns {
  UserId = 'user_id',
  GoogleId = 'google_id',
  Email = 'email',
  Password = 'password',
}

export const AUTH_TABLE: IDataTable = {
  name: EDataEntity.Auth,
  cols: [
    {name: EAuthColumns.UserId, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: EAuthColumns.Email, type: 'VARCHAR(200)', keys: ['UNIQUE']},
    {name: EAuthColumns.GoogleId, type: 'VARCHAR(50)', keys: ['UNIQUE']},
    {name: EAuthColumns.Password, type: 'VARCHAR(60)', keys: []},
  ]
};
