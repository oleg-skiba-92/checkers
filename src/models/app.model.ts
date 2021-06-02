import { Express, Request, Response } from 'express';
import * as http from 'http';
import { Session } from 'express-session';
import { NextFunction } from 'express-serve-static-core';

import { IAuthSession } from './auth.model';

export type TMiddleware = (request: IRequest, response: IResponse, next: NextFunction) => void;

export interface IInitializedService {
  initialise(server?: IServer): Promise<boolean>;
}

export interface IConfiguredService {
  config(): void;
}

export interface ISession extends Session{
  auth?: IAuthSession;
}

export interface IRequest extends Request {
  session: ISession
  authData?: IAuthSession;
}

export interface IResponse extends Response {

}

export interface IServer {
  app: Express;
  http: http.Server;

}
