import { IDataTable } from '../../../models/db.model';
import { USER_TABLE } from './users.db';
import { AUTH_TABLE } from './auth.db';
import { GUEST_COUNT_TABLE } from './guest-count.db';
import { RATING_TBL } from './rating.db';

export * from './auth.db';
export * from './guest-count.db';
export * from './rating.db';
export * from './users.db';

export const DB_TABLES: IDataTable[] = [
  {...USER_TABLE},
  {...AUTH_TABLE},
  {...GUEST_COUNT_TABLE},
  {...RATING_TBL},
];
