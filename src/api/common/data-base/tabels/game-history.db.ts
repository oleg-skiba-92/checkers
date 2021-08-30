import { EDataEntity } from '../../../models/db.model';

export enum EGameHistoryColumns {
  ID = 'id',
  History = 'history',
  DateCreated = 'date_created',
  Time = 'time',
  EndType = 'end_type',
}

export const GAME_HISTORY_TBL = {
  name: EDataEntity.GameHistory,
  cols: [
    {name: EGameHistoryColumns.ID, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: EGameHistoryColumns.History, type: 'VARCHAR(1000)', keys: []},
    {name: EGameHistoryColumns.DateCreated, type: 'VARCHAR(50)', keys: ['DEFAULT NOW()']},
    {name: EGameHistoryColumns.Time, type: 'INTEGER', keys: ['DEFAULT 0']},
    {name: EGameHistoryColumns.EndType, type: 'INTEGER', keys: []},
  ]
};
