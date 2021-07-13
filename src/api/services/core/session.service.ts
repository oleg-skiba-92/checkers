import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import * as redis from 'redis';

import { IInitializedService, IServer, TMiddleware } from '../../models/app.model';
import { ISessionService } from '../../models/session.model';

export class SessionService implements IInitializedService {
  private redisStore: connectRedis.RedisStore

  sessionMiddleware: TMiddleware;

  async initialise(server?: IServer): Promise<boolean> {
    let RedisStore = connectRedis(session)
    let redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    });
    this.redisStore = new RedisStore({
      client: redisClient
    });

    this.sessionMiddleware = session({
      secret: process.env.SESSION_SECRET,
      store: this.redisStore,
      resave: true,
      saveUninitialized: true,
        // proxy: true,
      cookie: {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 86400000
      }
    })

    return true;
  }
}

export const sessionService: ISessionService = new SessionService();
