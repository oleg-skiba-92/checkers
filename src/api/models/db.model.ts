//#region enums
import { IInitializedService } from './app.model';

export enum EDataEntity {
  Auth = 'auth',
  Users = 'users',
  GameHistory = 'game_history',
  HistoryPlayers = 'history_players',
  Rating = 'rating',
  GuestCount = 'guest_count',
}

//#endregion enums
//#region interfaces
export interface IColTable {
  name: string;
  type: string;
  keys: string[];
}

export interface IDataTable {
  name: string;
  cols: IColTable[];
}

export interface IDataService extends IInitializedService {
  reinitDB(oldTables?: IDataTable[]): Promise<void>;

  getObject<T>(entity: string, key: string, value: string | number): Promise<T>;

  createObject<T>(entity: string, data: T): Promise<T>;

  updateObject<T>(entity: string, key: string, value: string, data: T): Promise<T>;
}

//#endregion interfaces
