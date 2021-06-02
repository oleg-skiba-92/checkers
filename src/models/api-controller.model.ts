import { IApiResponse } from './api-response.model';
import { Logger, ILogger } from '../api/libs';
import { IRequest, IResponse, IServer, TMiddleware } from './app.model';

const log = new Logger('req');

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

//#region classes
export abstract class BaseController implements IBaseCtrl {
  log: ILogger;

  abstract get routes(): IControllerRoute[];

  abstract get prefix(): EAPIEndpoints;

  get middlewares(): TMiddleware[] {
    return [];
  }

  init(server: IServer) {
    this.log = new Logger(this.constructor.name.replace('Controller', 'Ctrl'));

    this.routes.forEach(route => {
      server.app[route.method](this.buildPath(route.path, route.isFullPath), this.logRequestMiddleware(), ...this.middlewares, ...(route.middlewares || []), async (req: IRequest, res: IResponse) => {

        let apiResponse: IApiResponse = await route.handler.apply(this, [
          this.retrieveDataFromRequest(route, req),
          req,
          res
        ]);

        apiResponse.send(res);

      });
    });
  }

  private buildPath(path: string, isFullPath: boolean = false): string {
    if (isFullPath) {
      return path;
    }
    return '/' + [EAPIEndpoints.Api, this.prefix, path].join('/');
  }

  private logRequestMiddleware() {
    return (req: IRequest, res: IResponse, next) => {
      log.info(`${req.method}: ${req.originalUrl.split('?')[0]}`, {body: req.body, params: req.query});
      next();
    }
  }

  private retrieveDataFromRequest(route: IControllerRoute, req: IRequest) {
    switch (route.method) {
      case 'get':
        return req.query;
      case 'post':
        return req.body;
    }

    return null;
  }
}

//#endregion classes