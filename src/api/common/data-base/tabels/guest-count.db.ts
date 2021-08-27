import { EDataEntity } from '../../../models/db.model';

export enum EGuestsColumns {
  Count = 'count',
}

export const GUEST_COUNT_TABLE = {
  name: EDataEntity.GuestCount,
  cols: [
    {name: EGuestsColumns.Count, type: 'INTEGER', keys: []},
  ]
};
