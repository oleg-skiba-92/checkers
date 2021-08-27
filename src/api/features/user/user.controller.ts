import { userData } from './user.data';
import { IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IRequest } from '../../models/app.model';
import { BaseController } from '../../common/controller/controller.base';
import { ResponseService } from '../../common/response/response.service';
import { IUserInfo, EAPIEndpoints } from '../../../models';
import { IAuthData } from '../auth/auth.model';

class UserController extends BaseController {
  get routes(): IControllerRoute[] {
    return [
      {path: EAPIEndpoints.Me, method: 'get', handler: this.getMe},
    ];
  }

  get prefix(): EAPIEndpoints {
    return EAPIEndpoints.User;
  }

  async userDisconnected(authData: IAuthData): Promise<void> {
    await userData.updateLastVisited(authData.userId);
  }

  async getMe(data, req: IRequest): Promise<IApiResponse> {
    let user: IUserInfo;

    try {
      user = await userData.toUserInfo(await userData.getById(req.authData.userId));
    } catch (e) {
      return ResponseService.unauthorized();
    }

    return ResponseService.successJson(user);
  }
}

export const UserCtrl = new UserController();
