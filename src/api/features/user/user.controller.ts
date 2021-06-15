import { userData } from './user.data';
import { IUserInfo } from './user.model';
import { EAPIEndpoints, IBaseCtrl, IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IRequest } from '../../models/app.model';
import { BaseController } from '../../common/controller/controller.base';
import { authService } from '../auth/auth.service';
import { ResponseService } from '../../common/response/response.service';

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
    let user: IUserInfo = userData.toUserInfo(await userData.getById(req.authData.userId));

    return ResponseService.successJson(user);
  }
}

export const UserCtrl: IUserCtrl = new UserController();
