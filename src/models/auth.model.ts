import { IInitializedService, IServer, TMiddleware } from './app.model';

export enum EAuthMethod {
  Google,
  Facebook,
  Password
}

export interface IAuthService  extends IInitializedService {
  route(server: IServer): void;

  isAuthorised(redirectPath: string): TMiddleware;
}

export interface IAuthClientInfo {
  id: string;
  email: string;
  picture: string;
  name: string;
}

export interface IAuthSession {
  userId: string;
  userName: string;
  loginMethod: EAuthMethod;
}
