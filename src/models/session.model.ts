import { IInitializedService, TMiddleware } from './app.model';

export interface ISessionService  extends IInitializedService{
  sessionMiddleware: TMiddleware;
}
