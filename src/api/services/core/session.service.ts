import { IInitializedService, IServer, ISessionService, TMiddleware } from '../../../models';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import * as redis from 'redis';

export class SessionService implements IInitializedService {
  private redisStore: connectRedis.RedisStore

  sessionMiddleware: TMiddleware;

  async initialise(server?: IServer): Promise<boolean> {
    let RedisStore = connectRedis(session)
    let redisClient = redis.createClient();
    this.redisStore = new RedisStore({
      client: redisClient
    });

    this.sessionMiddleware = session({
      secret: process.env.SESSION_SECRET,
      store: this.redisStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 86400000
      }
    })

    return true;
  }
}

export const sessionService: ISessionService = new SessionService();