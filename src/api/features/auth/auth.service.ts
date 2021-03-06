import * as jwt from 'jsonwebtoken';
import * as redis from 'redis';

const {google} = require('googleapis');
import { OAuth2Client } from 'google-auth-library';

import { ILogger, Logger } from '../../libs';
import { EApiErrorCode, IUserInfo } from '../../../models';
import { EAuthMethod, IAuthData, IAuthService, IGoogleUserInfo, IParsedToken } from './auth.model';
import { IRequest, IResponse, IServer } from '../../models/app.model';
import { ResponseService } from '../../common/response/response.service';

export class AuthService implements IAuthService {
  private log: ILogger = new Logger('AUTH');
  private googleClient: OAuth2Client;
  private redisClient: redis.RedisClient;

  constructor() {}

  async initialise(): Promise<boolean> {
    this.googleClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    return true;
  }

  config(server: IServer) {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      tls: {
        rejectUnauthorized: false
      }
    });

    this.redisClient.on("error", (err) => {
      // The set and get are aggregated in here
      this.log.error(err, err);
    });

    // NOTE: checking if the token is existing and has a correct format
    server.app.use('/api', async (req: IRequest, res: IResponse, next) => {
      //TODO another way?
      if(req.method === 'OPTIONS') {
        return next();
      }

      let header = req.header('Authorization');

      if (!header) {
        this.log.error('No Authorization header');

        let apiResponse = ResponseService.unauthorized(null, EApiErrorCode.NoToken);
        apiResponse.send(res);

        return;
      }

      let barerTokenMatch = header.match(/^Barer\s([0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*)$/);

      if (!barerTokenMatch || !barerTokenMatch[1]) {
        this.log.error('Token format invalid');

        let apiResponse = ResponseService.unauthorized(null, EApiErrorCode.ParseToken);
        apiResponse.send(res);

        return;
      }

      req.token = barerTokenMatch[1];

      next();
    });

    // NOTE: verify token
    server.app.use('/api', async (req: IRequest, res: IResponse, next) => {
      if(req.method === 'OPTIONS') {
        return next();
      }

      let data = await this.verifyToken(req.token);

      if (data.error !== null) {
        let apiResponse = ResponseService.unauthorized(null, data.error);
        apiResponse.send(res);

        return;
      }

      req.authData = <IAuthData>data.payload;
      req.isLoggedIn = req.authData.loginMethod !== EAuthMethod.Guest;

      next();
    });
  }

  googleAuthUrl(): string {
    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email']
    });
  }

  login(user: IUserInfo, loginMethod: EAuthMethod): string {
    let authData = {
      userId: user.id,
      userName: user.userName,
      loginMethod,
    };

    const token = this.generateJWTToken(authData);

    this.redisClient.set(user.id, token, (err) => {
      this.log.error('login', err);
      this.log.error(err);
    });

    this.log.success(`login`, authData);

    return token;
  }

  logout(userId: string) {
    this.redisClient.del(userId);
    this.log.success(`logout`);
  }

  async authenticateGoogle(code: string): Promise<IGoogleUserInfo> {
    try {
      const token = await this.getGoogleToken(code);
      return await this.getGoggleClientInfo(token);
    } catch (e) {
      throw new Error(e);
    }
  }

  generateJWTToken<T>(data: T): string {
    return jwt.sign({data}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRED});
  }

  async verifyToken(token: string): Promise<IParsedToken> {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);

      const realToken = await new Promise((resolve) => {
        this.redisClient.get((<IAuthData>decoded.data).userId, (err, data) => {
          resolve(data);
        });
      });

      if (!realToken || realToken !== token) {
        this.log.error(`Tokens mismatch ${!!realToken}`);
        this.logout((<IAuthData>decoded.data).userId);

        return {error: EApiErrorCode.InvalidToken, payload: null};
      }

      return {error: null, payload: decoded.data};
    } catch (e) {
      if (e.name == 'TokenExpiredError') {
        this.log.error('token expired');
        return {error: EApiErrorCode.TokenExpired, payload: null};
      }

      this.log.error('jwt.verify error', e);
      return {error: EApiErrorCode.InvalidToken, payload: null};
    }
  }

  refreshToken(token: string) {
    let decoded = jwt.decode(token);

    if (decoded === null) {
      throw new Error('Invalid Decode token');
    }

    let newToken = this.generateJWTToken(decoded.data);
    this.redisClient.set(decoded.data.userId, newToken);

    this.log.success(`refreshToken`, decoded.data);

    return newToken;
  }

  private async getGoggleClientInfo(accessToken: string): Promise<IGoogleUserInfo> {
    let oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({access_token: accessToken});

    let oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    const {data} = await oauth2.userinfo.get();

    return {
      id: data.id,
      email: data.email || null,
      picture: data.picture || null,
      name: data.name || '',
    };
  }

  private async getGoogleToken(code): Promise<string> {
    const {tokens} = await this.googleClient.getToken(code);

    return tokens.access_token;
  }

}

export const authService = new AuthService();


