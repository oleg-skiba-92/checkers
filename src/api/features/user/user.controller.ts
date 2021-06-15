import { userData } from './user.data';
import { IBaseCtrl, IControllerRoute } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IRequest } from '../../models/app.model';
import { BaseController } from '../../common/controller/controller.base';
import { ResponseService } from '../../common/response/response.service';
import { IUserInfo } from '../../../models';
import { EAPIEndpoints } from '../../../models/api.model';

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

  async getMe(data, req: IRequest): Promise<IApiResponse> {
    let user: IUserInfo;

    if(!!req.authData) {
      user = await this.getAuthorisedData(req.userId);
    } else {
      user = await this.getUnauthorisedData(req.userId, req.sessionID);
    }

    return ResponseService.successJson(user);
  }

  private async getAuthorisedData(userId: string): Promise<IUserInfo> {
    return userData.toUserInfo(await userData.getById(userId));
  }

  private async getUnauthorisedData(userId: string, sessionId :string): Promise<IUserInfo> {
    return {id: userId, userName: 'Anonymous'};
  }
}

export const UserCtrl: IUserCtrl = new UserController();
