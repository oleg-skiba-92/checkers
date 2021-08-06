import * as bcrypt from 'bcrypt-nodejs';
import { v4 as uuidv4 } from 'uuid';

import { IRegistrationRequest, IUserInfo } from '../../../models';
import { authService } from './auth.service';
import { userData } from '../user/user.data';
import { guestData } from '../guest/guest.data';
import { EAuthMethod, IGoogleUserInfo } from './auth.model';
import { IUserTable } from '../user/user.model';
import { BaseController } from '../../common/controller/controller.base';
import { IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { ResponseService } from '../../common/response/response.service';
import { IRequest } from '../../models/app.model';
import { EAPIEndpoints } from '../../../models/api.model';

class AuthController extends BaseController {
  get routes(): IControllerRoute[] {
    return [
      {path: `/${this.prefix}/${EAPIEndpoints.Google}`, isFullPath: true, method: 'get', handler: this.getGoogleAuthUrl},
      {path: `/${this.prefix}/${EAPIEndpoints.GoogleCallback}`, isFullPath: true, method: 'get', handler: this.googleCallback},
      {path: EAPIEndpoints.Registration, method: 'post', handler: this.registration},
      {path: EAPIEndpoints.Login, method: 'post', handler: this.login},
      {path: EAPIEndpoints.LoginAsGuest, method: 'post', handler: this.loginAsGuest},
      {path: EAPIEndpoints.Logout, method: 'get', handler: this.logout},
      {path: EAPIEndpoints.RefreshToken, method: 'post', handler: this.refreshToken},
    ];
  }

  get prefix(): EAPIEndpoints {
    return null;
  }

  get basePath(): EAPIEndpoints {
    return EAPIEndpoints.Auth;
  }

  private async getGoogleAuthUrl(): Promise<IApiResponse> {
    return ResponseService.redirect(authService.googleAuthUrl());
  }

  private async googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse> {
    try {
      let authUser: IGoogleUserInfo = await authService.authenticateGoogle(data.code);
      let user: IUserInfo = await this.loginWithGoggle(authUser);

      authService.login(user, EAuthMethod.Google);

      return ResponseService.redirect('/');
    } catch (e) {
      this.log.error(`authenticate Google`, e);
      return ResponseService.redirect('/login');
    }
  }

  private async registration(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password || !data.password) {
      return ResponseService.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`);
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

    let userInfo = userData.toUserInfo(user);
    authService.login(userInfo, EAuthMethod.Password);

    return ResponseService.successJson(userInfo);
  }

  private async login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password) {
      return ResponseService.badRequest('ALL_FIELDS_REQUIRED', `Всі поля повинні бути заповнені`);
    }

    let user = await userData.getByEmail(req.body.email);
    if (!user) {
      return ResponseService.badRequest('USER_DOES_NOT_EXIST', `Юзера з таким емейлом не існує`);
    }

    if (!user.password || !bcrypt.compareSync(req.body.password, user.password)) {
      return ResponseService.badRequest('INVALID_PASSWORD', `Пароль не вірний`);
    }

    let userInfo = userData.toUserInfo(user);
    authService.login(userInfo, EAuthMethod.Password);

    return ResponseService.successJson(userInfo);
  }

  private async logout(data: {userId: string}, req: IRequest): Promise<IApiResponse> {
    authService.logout(data.userId);
    return ResponseService.redirect('/login');
  }

  private async loginAsGuest(data, req: IRequest): Promise<IApiResponse> {
    let guest = guestData.toUserInfo(await guestData.create({
      id: uuidv4(),
      user_name: 'Guest'
    }));

    let token = authService.login(guest, EAuthMethod.Guest);

    return ResponseService.successJson({user: guest, token});
  }

  private async refreshToken(data: {token: string}, req: IRequest): Promise<IApiResponse> {
    try {
      return ResponseService.successJson({token: authService.refreshToken(data.token)});
    } catch (e) {
      return ResponseService.unauthorized();
    }
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
      });
    }

    if (tableUser && tableUser.google_id !== data.id) {
      tableUser.google_id = data.id;
      await userData.updateGoogleId(tableUser.id, tableUser.google_id);
    }

    return userData.toUserInfo(tableUser);
  }
}

export const AuthCtrl = new AuthController();
