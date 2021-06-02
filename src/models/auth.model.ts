import { IInitializedService, IRequest, TMiddleware } from './app.model';
import { IUserInfo } from './user.model';

export enum EAuthMethod {
  Google,
  Password
}

export interface IAuthService extends IInitializedService {
  googleAuthUrl(): string;

  authenticateGoogle(code: string): Promise<IGoogleUserInfo>;

  isAuthorised(redirectPath: string): TMiddleware;

  login(user: IUserInfo, loginMethod: EAuthMethod, req: IRequest): void;

  logout(req: IRequest): void;
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
