import { EApiErrorCode, IUserInfo } from '../../../models';
import { IInitializedService } from '../../models/app.model';

export enum EAuthMethod {
  Google,
  Password,
  Guest,
}

export interface IAuthTable {
  user_id: string;
  google_id?: string;
  email?: string;
  password?: string;
}

export interface IGoogleUserInfo {
  id: string;
  email: string;
  picture: string;
  name: string;
}

export interface IAuthData {
  userId: string;
  userName: string;
  loginMethod: EAuthMethod;
}

export interface IParsedToken {
  error: EApiErrorCode;
  payload: IAuthData;
}

export interface IAuthService extends IInitializedService {
  googleAuthUrl(): string;

  authenticateGoogle(code: string): Promise<IGoogleUserInfo>;

  login(user: IUserInfo, loginMethod: EAuthMethod): string;

  logout(userId: string): void;
}

export interface IAuthDataService {
  create(data: IAuthTable): Promise<IAuthTable>;

  getByGoogleId(id: string): Promise<IAuthTable>;

  getByUserId(id: string): Promise<IAuthTable>;

  getByEmail(email: string): Promise<IAuthTable>;

  updatePassword(userId: string, passwordHash: string): Promise<void>;

  updateGoogleId(userId: string, googleId: string): Promise<void>;
}
