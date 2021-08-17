import { EApiErrorCode, IUserInfo } from '../../../models';
import { IInitializedService } from '../../models/app.model';

export enum EAuthMethod {
  Google,
  Password,
  Guest,
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
