import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt-nodejs';

import { IRegistrationRequest, IUserInfo } from '../../../models';
import { authService } from './auth.service';
import { userData } from '../user/user.data';
import { EAuthMethod, IAuthCtrl, IGoogleUserInfo } from './auth.model';
import { IUserTable } from '../user/user.model';
import { BaseController } from '../../common/controller/controller.base';
import { EAPIEndpoints, IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { ResponseService } from '../../common/response/response.service';
import { IRequest } from '../../models/app.model';

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
    return ResponseService.redirect(authService.googleAuthUrl());
  }

  async googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse> {
    try {
      let authUser: IGoogleUserInfo = await authService.authenticateGoogle(data.code);
      let user: IUserInfo = await this.loginWithGoggle(authUser);

      authService.login(user, EAuthMethod.Google, req);

      return ResponseService.redirect('/');
    } catch (e) {
      this.log.error(`authenticate Google`, e);
      return ResponseService.redirect('/login')
    }
  }

  async registration(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password || !data.password) {
      return ResponseService.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`)
    }

    let user = await userData.getByEmail(data.email);

    if (user && user.password) {
      return ResponseService.badRequest('USER_EXIST', `Юзер з таким емейлом вже існує`);
    }

    let pass = bcrypt.hashSync(req.body.password);

    if (user) {
      await userData.updatePassword(user.id, pass);
    } else {
      user = await userData.createUser({
        id: uuidv4(),
        user_name: data.userName,
        email: data.email,
        password: pass
      });
    }

    authService.login(userData.toUserInfo(user), EAuthMethod.Password, req);

    return ResponseService.successJson();
  }

  async login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password) {
      return ResponseService.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`)
    }

    let user = await userData.getByEmail(req.body.email);
    if (!user) {
      return ResponseService.badRequest('USER_DOES_NOT_EXIST', `Юзера з таким емейлом не існує`)
    }

    if (!user.password || !bcrypt.compareSync(req.body.password, user.password)) {
      return ResponseService.badRequest('INVALID_PASSWORD', `Пароль не вірний`);
    }

    authService.login(userData.toUserInfo(user), EAuthMethod.Password, req);

    return ResponseService.successJson();
  }

  async logout(data, req: IRequest): Promise<IApiResponse> {
    authService.logout(req);
    return ResponseService.redirect('/login');
  }

  private async loginWithGoggle(data: IGoogleUserInfo): Promise<IUserInfo> {
    let tableUser: IUserTable = await userData.getByGoogleId(data.id);

    if (!tableUser && !!data.email) {
      tableUser = await userData.getByEmail(data.email);
    }

    if (!tableUser) {
      tableUser = await userData.createUser({
        id: uuidv4(),
        user_name: data.name,
        google_id: data.id,
        email: data.email
      })
    }

    if (tableUser && tableUser.google_id !== data.id) {
      tableUser.google_id = data.id;
      await userData.updateGoogleId(tableUser.id, tableUser.google_id);
    }

    return userData.toUserInfo(tableUser);
  }
}

export const AuthCtrl: IAuthCtrl = new AuthController();
