import { EDataEntity, IDataTable } from '../../../models/db.model';

export enum ERatingColumns {
  UserId = 'user_id',
  Rating = 'rating',
  Wins = 'wins',
  Looses = 'looses',
  Draws = 'draws',
}

export const RATING_TBL: IDataTable = {
  name: EDataEntity.Rating,
  cols: [
    {name: ERatingColumns.UserId, type: 'VARCHAR(36)', keys: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY']},
    {name: ERatingColumns.Rating, type: 'INTEGER', keys: ['DEFAULT 0']},
    {name: ERatingColumns.Wins, type: 'INTEGER', keys: ['DEFAULT 0']},
    {name: ERatingColumns.Looses, type: 'INTEGER', keys: ['DEFAULT 0']},
    {name: ERatingColumns.Draws, type: 'INTEGER', keys: ['DEFAULT 0']},
  ]
};
