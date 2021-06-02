import { google, } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { NextFunction } from 'express-serve-static-core';
import * as graph from 'fbgraph';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt-nodejs';

import {
  EAuthMethod,
  IAuthClientInfo,
  IAuthService,
  IRequest,
  IResponse, IServer,
  IUserTable,
  TMiddleware
} from '../../models';
import { ILogger, Logger } from '../../libs/logger';
import { userService } from '../data/user.service';

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

  route(server: IServer) {
    server.app.get('/auth/google', (req, res: IResponse) => {
      this.log.info(`login with google`);
      const url = this.googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
      });

      return res.redirect(url)
    });

    server.app.get('/auth/google/callback', async (req: IRequest, res: IResponse) => {
      let authUser: IAuthClientInfo;
      let user: IUserTable;

      try {
        authUser = await this.authenticateGoogle(<string>req.query['code']);
      } catch (e) {
        this.log.error(`authenticate Google`, e);

        return res.redirect('/login');
      }

      try {
        user = await userService.getByGoogleId(authUser.id, authUser.name, authUser.email);
      } catch (e) {
        this.log.error(`getByGoogleId`, e);
        return res.redirect('/login');
      }

      req.session['auth'] = {
        userId: user.id.toString(),
        userName: user.user_name,
        loginMethod: EAuthMethod.Google,
      }

      this.log.success(`login with google`, req.session['auth']);

      return res.redirect('/')
    });

    server.app.get('/auth/facebook', (req: IRequest, res: IResponse) => {
      this.log.info(`login with facebook`);
      const url = graph.getOauthUrl({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URL,
        scope: 'email',
      });

      return res.redirect(url);
    });

    server.app.get('/auth/facebook/callback', async (req: IRequest, res: IResponse) => {
      let authUser: IAuthClientInfo;
      let user: IUserTable;

      try {
        authUser = await this.authenticateFacebook(<string>req.query['code']);
      } catch (e) {
        this.log.error(`authenticateFacebook`, e);

        return res.redirect('/login');
      }

      try {
        user = await userService.getByFacebookId(authUser.id, authUser.name, authUser.email);
      } catch (e) {
        this.log.error(`getByFacebookId`, e);
        return res.redirect('/login');
      }

      req.session['auth'] = {
        userId: user.id.toString(),
        userName: user.user_name,
        loginMethod: EAuthMethod.Facebook,
      }
      this.log.success(`login with facebook`, req.session['auth']);

      return res.redirect('/')
    });

    server.app.post('/auth/registration', async (req: IRequest, res: IResponse) => {
      if (!req.body.email || !req.body.userName || !req.body.password) {
        res.status(400);
        res.json({
          message: `Всі поля повинні бути заповнені`,
          error: 'ALL_FIELDS_REQUIRED'
        });

        return;
      }

      let user = await userService.getByEmail(req.body.email);
      if (user && user.password) {
        res.status(400);
        res.json({
          message: `Юзер з таким емейлом вже існує`,
          error: `USER_EXIST`
        });

        return;
      }

      let pass = bcrypt.hashSync(req.body.password);

      if (user) {
        await userService.updatePassword(user.id, pass);
      } else {
        user = await userService.registerUser(req.body.userName, req.body.email, pass);
      }

      req.session['auth'] = {
        userId: user.id.toString(),
        userName: user.user_name,
        loginMethod: EAuthMethod.Password,
      }

      this.log.success(`registration`, req.session['auth']);

      res.status(200);
      res.json(`success`);
    });

    server.app.post('/auth/login', async (req: IRequest, res: IResponse) => {
      if (!req.body.email || !req.body.password) {
        res.status(400);
        res.json({
          message: `Всі поля повинні бути заповнені`,
          error: 'ALL_FIELDS_REQUIRED'
        });

        return;
      }

      let user = await userService.getByEmail(req.body.email);
      if (!user) {
        res.status(400);
        res.json({
          message: `Юзера з таким емейлом не існує`,
          error: `USER_EXIST`
        });

        return;
      }

      if (!user.password || !bcrypt.compareSync(req.body.password, user.password)) {
        res.status(400);
        res.json({
          message: `Пароль не вірний`,
          error: `INVALID_PASSWORD`
        });

        return;
      }

      req.session['auth'] = {
        userId: user.id.toString(),
        userName: user.user_name,
        loginMethod: EAuthMethod.Password,
      }

      this.log.success(`login`, req.session['auth']);

      res.status(200);
      res.json(`success`);
    });

    server.app.get('/auth/logout', (req, res) => {
      req.session['auth'] = null;
      return res.redirect('/login')
    })
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

  private async authenticateGoogle(code: string): Promise<IAuthClientInfo> {
    try {
      const token = await this.getGoogleToken(code);
      return await this.getGoggleClientInfo(token)
    } catch (e) {
      throw new Error(e)
    }
  }

  private async getGoggleClientInfo(accessToken: string): Promise<IAuthClientInfo> {
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

  private async authenticateFacebook(code: string): Promise<IAuthClientInfo> {
    try {
      const token = await this.getFacebookToken(code);
      return await this.getFacebookClientInfo();
    } catch (e) {
      throw new Error(e)
    }
  }

  private getFacebookClientInfo(): Promise<IAuthClientInfo> {
    return new Promise((resolve, reject) => {
      graph.get('me?fields=email,name,id,picture', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          id: data.id,
          email: data.email || null,
          picture: (data.picture && data.picture.data && data.picture.data.url) || null,
          name: data.name || '',
        });
      })
    });
  }

  private getFacebookToken(code): Promise<string> {
    return new Promise((resolve, reject) => {
      graph.authorize({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URL,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        code: code
      }, function(err, data) {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.access_token);
      });
    });
  }

  public generateJWTToken(data) {
    return jwt.sign({data}, process.env.JWT_SECRET, {expiresIn: '1d'});
  }
}

export const authService = new AuthService();


