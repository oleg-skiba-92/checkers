import {
  BaseController,
  EAPIEndpoints,
  IApiResponse,
  IBaseCtrl,
  IControllerRoute,
  IRequest,
  IUserInfo
} from '../../models';
import { authService } from '../services/core';
import { userService } from '../services/data/user.service';
import { ResHelper } from '../libs';

export interface IUserCtrl extends IBaseCtrl {
  getMe(data: null, req: IRequest): Promise<IApiResponse>;
}

class UserController extends BaseController implements IUserCtrl {
  get routes(): IControllerRoute[] {
    return [
      {path: EAPIEndpoints.Me, method: 'get', handler: this.getMe},
    ];
  }

  get prefix(): EAPIEndpoints {
    return EAPIEndpoints.User;
  }

  get middlewares() {
    return [authService.isAuthorised('/login')];
  }

  async getMe(data, req: IRequest): Promise<IApiResponse> {
    let user: IUserInfo = userService.toUserInfo(await userService.getById(req.authData.userId));

    return ResHelper.successJson(user);
  }
}

export const UserCtrl: IUserCtrl = new UserController();
