import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt-nodejs';

import {
  BaseController,
  EAPIEndpoints,
  EAuthMethod,
  IApiResponse,
  IGoogleUserInfo,
  IBaseCtrl,
  IControllerRoute,
  ILoginRequest,
  IRegistrationRequest,
  IRequest,
  IUserInfo,
  IUserTable
} from '../../models';
import { authService } from '../services/core';
import { ResHelper } from '../libs';
import { userService } from '../services/data/user.service';

export interface IAuthCtrl extends IBaseCtrl {
  getGoogleAuthUrl(): Promise<IApiResponse>;

  googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse>;

  registration(data: ILoginRequest, req: IRequest): Promise<IApiResponse>;

  login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse>;

  logout(data: null, req: IRequest): Promise<IApiResponse>;
}

class AuthController extends BaseController implements IAuthCtrl {
  get routes(): IControllerRoute[] {
    return [
      {path: `/${this.prefix}/${EAPIEndpoints.Google}`, isFullPath: true, method: 'get', handler: this.getGoogleAuthUrl},
      {path: `/${this.prefix}/${EAPIEndpoints.GoogleCallback}`, isFullPath: true, method: 'get', handler: this.googleCallback},
      {path: `/${this.prefix}/${EAPIEndpoints.Registration}`, isFullPath: true, method: 'post', handler: this.registration},
      {path: `/${this.prefix}/${EAPIEndpoints.Login}`, isFullPath: true, method: 'post', handler: this.login},
      {path: `/${this.prefix}/${EAPIEndpoints.Logout}`, isFullPath: true, method: 'get', handler: this.logout},
    ];
  }

  get prefix(): EAPIEndpoints {
    return EAPIEndpoints.Auth;
  }

  async getGoogleAuthUrl(): Promise<IApiResponse> {
    return ResHelper.redirect(authService.googleAuthUrl());
  }

  async googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse> {
    try {
      let authUser: IGoogleUserInfo = await authService.authenticateGoogle(data.code);
      let user: IUserInfo = await this.loginWithGoggle(authUser);

      authService.login(user, EAuthMethod.Google, req);

      return ResHelper.redirect('/');
    } catch (e) {
      this.log.error(`authenticate Google`, e);
      return ResHelper.redirect('/login')
    }
  }

  async registration(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password || !data.password) {
      return ResHelper.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`)
    }

    let user = await userService.getByEmail(data.email);

    if (user && user.password) {
      return ResHelper.badRequest('USER_EXIST', `Юзер з таким емейлом вже існує`);
    }

    let pass = bcrypt.hashSync(req.body.password);

    if (user) {
      await userService.updatePassword(user.id, pass);
    } else {
      user = await userService.createUser({
        id: uuidv4(),
        user_name: data.userName,
        email: data.email,
        password: pass
      });
    }

    authService.login(userService.toUserInfo(user), EAuthMethod.Password, req);

    return ResHelper.successJson();
  }

  async login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password) {
      return ResHelper.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`)
    }

    let user = await userService.getByEmail(req.body.email);
    if (!user) {
      return ResHelper.badRequest('USER_DOES_NOT_EXIST', `Юзера з таким емейлом не існує`)
    }

    if (!user.password || !bcrypt.compareSync(req.body.password, user.password)) {
      return ResHelper.badRequest('INVALID_PASSWORD', `Пароль не вірний`);
    }

    authService.login(userService.toUserInfo(user), EAuthMethod.Password, req);

    return ResHelper.successJson();
  }

  async logout(data, req: IRequest): Promise<IApiResponse> {
    authService.logout(req);
    return ResHelper.redirect('/login');
  }

  private async loginWithGoggle(data: IGoogleUserInfo): Promise<IUserInfo> {
    let tableUser: IUserTable = await userService.getByGoogleId(data.id);

    if (!tableUser && !!data.email) {
      tableUser = await userService.getByEmail(data.email);
    }

    if (!tableUser) {
      tableUser = await userService.createUser({
        id: uuidv4(),
        user_name: data.name,
        google_id: data.id,
        email: data.email
      })
    }

    if (tableUser && tableUser.google_id !== data.id) {
      tableUser.google_id = data.id;
      await userService.updateGoogleId(tableUser.id, tableUser.google_id);
    }

    return userService.toUserInfo(tableUser);
  }
}

export const AuthCtrl: IAuthCtrl = new AuthController();
