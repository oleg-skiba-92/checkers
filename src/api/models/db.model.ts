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

export enum EDBFunctions {
  AppendNumberGuest = 'append_number_guest',
  CreateRating = 'create_rating',
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
  triggers?: IDBTrigger[];
}

export interface IDBTrigger {
  name: string;
  onType: 'BEFORE' | 'AFTER';
  event: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  fnName: EDBFunctions,
}

export interface IDataService extends IInitializedService {
  reinitDB(oldTables?: IDataTable[]): Promise<void>;

  getObject<T>(entity: string, key: string, value: string | number): Promise<T>;

  createObject<T>(entity: string, data: T): Promise<T>;

  updateObject<T>(entity: string, key: string, value: string, data: T): Promise<T>;
}

//#endregion interfaces
