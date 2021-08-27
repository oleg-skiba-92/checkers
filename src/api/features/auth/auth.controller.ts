import * as bcrypt from 'bcrypt-nodejs';
import { v4 as uuidv4 } from 'uuid';

import { EApiValidationError, IRegistrationRequest, IUserInfo } from '../../../models';
import { authService } from './auth.service';
import { userData } from '../user/user.data';
import { authData } from './auth.data';
import { EAuthMethod, IGoogleUserInfo } from './auth.model';
import { BaseController } from '../../common/controller/controller.base';
import { IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { ResponseService } from '../../common/response/response.service';
import { IRequest } from '../../models/app.model';
import { EAPIEndpoints } from '../../../models/api.model';

export class AuthController extends BaseController {
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

  async getGoogleAuthUrl(): Promise<IApiResponse> {
    return ResponseService.redirect(authService.googleAuthUrl());
  }

  async googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse> {
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

  async registration(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password || !data.userName) {
      let errors = [];

      if (!data.email) {
        errors.push({field: 'email', error: EApiValidationError.Required});
      }

      if (!data.password) {
        errors.push({field: 'password', error: EApiValidationError.Required});
      }

      if (!data.userName) {
        errors.push({field: 'userName', error: EApiValidationError.Required});
      }

      return ResponseService.validationError(errors);
    }

    let auth = await authData.getByEmail(data.email);

    if (auth && auth.password) {
      return ResponseService.validationError([{field: 'email', error: EApiValidationError.UserExist}]);
    }

    let pass = bcrypt.hashSync(req.body.password);

    if (auth) {
      await authData.updatePassword(auth.user_id, pass);
    } else {
      auth = await authData.create({
        user_id: uuidv4(),
        email: data.email,
        password: pass,
        google_id: null
      });

      await this.createUserProcess(auth.user_id, data.userName, false);
    }

    let userInfo = userData.toUserInfo(await userData.getById(auth.user_id));
    let token = authService.login(userInfo, EAuthMethod.Password);

    return ResponseService.successJson({user: userInfo, token});
  }

  async login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse> {
    if (!data.email || !data.password) {
      let errors = [];

      if (!data.email) {
        errors.push({field: 'email', error: EApiValidationError.Required});
      }

      if (!data.password) {
        errors.push({field: 'password', error: EApiValidationError.Required});
      }

      return ResponseService.validationError(errors);
    }

    let auth = await authData.getByEmail(req.body.email);
    if (!auth) {
      return ResponseService.validationError([{field: 'email', error: EApiValidationError.UserNotFound}]);
    }

    if (!auth.password || !bcrypt.compareSync(req.body.password, auth.password)) {
      return ResponseService.validationError([{field: 'password', error: EApiValidationError.PasswordIncorrect}]);
    }

    let userInfo = userData.toUserInfo(await userData.getById(auth.user_id));
    let token = authService.login(userInfo, EAuthMethod.Password);

    return ResponseService.successJson({user: userInfo, token});
  }

  async logout(data: { userId: string }, req: IRequest): Promise<IApiResponse> {
    authService.logout(data.userId);
    return ResponseService.redirect('/login');
  }

  async loginAsGuest(data, req: IRequest): Promise<IApiResponse> {
    let id = uuidv4();

    await this.createUserProcess(id, 'Guest', true);

    let userInfo = userData.toUserInfo(await userData.getById(id));
    let token = authService.login(userInfo, EAuthMethod.Guest);

    return ResponseService.successJson({user: userInfo, token});
  }

  private async refreshToken(data: { token: string }, req: IRequest): Promise<IApiResponse> {
    // return ResponseService.unauthorized();

    try {
      return ResponseService.successJson({token: authService.refreshToken(data.token)});
    } catch (e) {
      return ResponseService.unauthorized();
    }
  }

  /**@deprecated*/
  private async loginWithGoggle(data: IGoogleUserInfo): Promise<IUserInfo> {
    // let tableUser: IUserTable = await userData.getByGoogleId(data.id);
    //
    // if (!tableUser && !!data.email) {
    //   tableUser = await userData.getByEmail(data.email);
    // }
    //
    // if (!tableUser) {
    //   tableUser = await userData.createUser({
    //     id: uuidv4(),
    //     user_name: data.name,
    //     google_id: data.id,
    //     email: data.email
    //   });
    // }
    //
    // if (tableUser && tableUser.google_id !== data.id) {
    //   tableUser.google_id = data.id;
    //   await userData.updateGoogleId(tableUser.id, tableUser.google_id);
    // }
    //
    // return userData.toUserInfo(tableUser);
    return <any>{};
  }

  private async createUserProcess(id: string, userName: string, isGuest: boolean = false): Promise<any> {
    let user = await userData.createUser({
      id,
      is_guest: isGuest,
      user_name: userName,
      picture: null
    });

    // TODO rating

    return user;
  }
}

export const AuthCtrl = new AuthController();
