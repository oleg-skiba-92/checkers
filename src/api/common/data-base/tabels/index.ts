import { IDataTable } from '../../../models/db.model';
import { USER_TABLE } from './users.db';
import { AUTH_TABLE } from './auth.db';
import { GUEST_COUNT_TABLE } from './guest-count.db';
import { RATING_TBL } from './rating.db';
import { GAME_HISTORY_TBL } from './game-history.db';
import { HISTORY_PLAYERS_TBL } from './history-players.db';

export * from './auth.db';
export * from './game-history.db';
export * from './guest-count.db';
export * from './history-players.db';
export * from './rating.db';
export * from './users.db';

export const DB_TABLES: IDataTable[] = [
  {...USER_TABLE},
  {...AUTH_TABLE},
  {...GUEST_COUNT_TABLE},
  {...RATING_TBL},
  {...GAME_HISTORY_TBL},
  {...HISTORY_PLAYERS_TBL},
];
