//#region enums
import { IInitializedService } from './app.model';

export enum EDataEntity {
  Users = 'users',
}

export enum EUsersColumns {
  ID = 'id',
  GoogleId = 'google_id',
  UserName = 'user_name',
  Password = 'password',
  DateCreated = 'date_created',
  Email = 'email',
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

export interface IUserTable {
  id: string;
  email: string;
  google_id?: string;
  user_name?: string;
  password?: string;
  date_created?: string;
}

export interface IDataService extends IInitializedService {
  getObject<T>(entity: string, key: string, value: string | number): Promise<T>;

  createObject<T>(entity: string, data: T): Promise<T>;

  updateObject<T>(entity: string, key: string, value: string, data: T): Promise<T>;
}

//#endregion interfaces
