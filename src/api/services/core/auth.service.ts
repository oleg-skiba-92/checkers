import { google, } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { NextFunction } from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';

import {
  EAuthMethod,
  IGoogleUserInfo,
  IAuthService,
  IRequest,
  IResponse,
  IServer,
  IUserInfo,
  TMiddleware
} from '../../../models';
import { ILogger, Logger } from '../../libs';

export class AuthService implements IAuthService {
  private log: ILogger = new Logger('AUTH');
  private googleClient: OAuth2Client;

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
    server.app.use((req: IRequest, res: IResponse, next) => {
      req.authData = (req.session && req.session.auth) || null;
      next();
    });
  }

  isAuthorised(redirectPath: string): TMiddleware {
    return async (req: IRequest, res: IResponse, next: NextFunction) => {
      if (!req.session || !req.session.auth) {
        if (!req.session) {
          this.log.error(`session`);
        } else {
          this.log.error(`auth`,);
        }

        return res.redirect(redirectPath);
      }

      return next();
    }
  }

  googleAuthUrl(): string {
    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email']
    });
  }

  login(user: IUserInfo, loginMethod: EAuthMethod, req: IRequest) {
    req.session['auth'] = {
      userId: user.id,
      userName: user.userName,
      loginMethod,
    }
    this.log.success(`login`, req.session['auth']);
  }

  logout(req: IRequest) {
    req.session['auth'] = null;
    this.log.success(`logout`);
  }

  async authenticateGoogle(code: string): Promise<IGoogleUserInfo> {
    try {
      const token = await this.getGoogleToken(code);
      return await this.getGoggleClientInfo(token)
    } catch (e) {
      throw new Error(e)
    }
  }

  private async getGoggleClientInfo(accessToken: string): Promise<IGoogleUserInfo> {
    let oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({access_token: accessToken});

    let oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    const {data} = await oauth2.userinfo.get()

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

  private generateJWTToken(data) {
    return jwt.sign({data}, process.env.JWT_SECRET, {expiresIn: '1d'});
  }
}

export const authService = new AuthService();


