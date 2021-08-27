import { EDataEntity } from '../../../models/db.model';

export enum EHistoryPlayersColumns {
  HistoryId = 'history_id',
  UserId = 'user_id',
  Color = 'color',
}

export const HISTORY_PLAYERS_TBL = {
  name: EDataEntity.HistoryPlayers,
  cols: [
    {name: EHistoryPlayersColumns.HistoryId, type: 'VARCHAR(36)', keys: ['NOT NULL']},
    {name: EHistoryPlayersColumns.UserId, type: 'VARCHAR(36)', keys: ['NOT NULL']},
    {name: EHistoryPlayersColumns.Color, type: 'INTEGER', keys: []},
  ]
};
