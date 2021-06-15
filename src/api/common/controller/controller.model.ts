import { ILogger } from '../../libs';
import { IRequest, IResponse, IServer, TMiddleware } from '../../models/app.model';
import { IApiResponse } from '../response/api-response.model';

//#region enums
export const enum EAPIEndpoints {
  Api = 'api',
  Auth = 'auth',
  User = 'user',
  Me = 'me',
  Google = 'google',
  GoogleCallback = 'google/callback',
  Registration = 'registration',
  Login = 'login',
  Logout = 'logout',
}

//#endregion enums

//#region types
export type TRouteHandler = (data?: object, req?: IRequest, res?: IResponse) => Promise<IApiResponse>;
//#endregion types

//#region interfaces
export interface IControllerRoute {
  path: string;
  method: 'post' | 'get';
  isFullPath?: boolean;
  provideRequest?: boolean;
  middlewares?: TMiddleware[];
  handler: TRouteHandler;
}

export interface IBaseCtrl {
  log: ILogger;
  routes: IControllerRoute[];
  prefix: EAPIEndpoints;
  middlewares: TMiddleware[]

  init(server: IServer): void;
}

//#endregion interfaces
