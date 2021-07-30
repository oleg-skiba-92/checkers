import { userData } from './user.data';
import { IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IRequest } from '../../models/app.model';
import { BaseController } from '../../common/controller/controller.base';
import { ResponseService } from '../../common/response/response.service';
import { IUserInfo } from '../../../models';
import { EAPIEndpoints } from '../../../models/api.model';
import { guestData } from '../guest/guest.data';
import { EAuthMethod, IAuthData } from '../auth/auth.model';

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
    if (authData.loginMethod === EAuthMethod.Guest) {
      await guestData.updateLastVisited(authData.userId);
    } else {
      await userData.updateLastVisited(authData.userId);
    }
  }

  async getMe(data, req: IRequest): Promise<IApiResponse> {
    let user: IUserInfo;

    if (!!req.isLoggedIn) {
      user = await this.getAuthorisedData(req.authData.userId);
    } else {
      user = await this.getUnauthorisedData(req.authData.userId);
    }

    return ResponseService.successJson(user);
  }

  private async getAuthorisedData(userId: string): Promise<IUserInfo> {
    return userData.toUserInfo(await userData.getById(userId));
  }

  private async getUnauthorisedData(userId: string): Promise<IUserInfo> {
    return guestData.toUserInfo(await guestData.getById(userId));
  }
}

export const UserCtrl = new UserController();
