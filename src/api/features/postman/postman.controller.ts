import { BaseController } from '../../common/controller/controller.base';
import { IControllerRoute } from '../../common/controller/controller.model';
import { EAPIEndpoints } from '../../../models';
import { IApiResponse } from '../../common/response/api-response.model';
import { ResponseService } from '../../common/response/response.service';
import { dataService } from '../../services/core';

class PostmanController extends BaseController {
  get routes(): IControllerRoute[] {
    return [
      {path: `/1`, method: 'post', handler: this.a1},
      {path: `/reinit`, method: 'post', handler: this.reinit},
    ];
  }

  get prefix(): EAPIEndpoints {
    return EAPIEndpoints.Postman;
  }

  async reinit(){
    try {
      await dataService.reinitDB([{name: 'guests', cols:[]}, {name: 'users', cols:[]}]);
      return ResponseService.successJson('ok');
    } catch (e) {
      return ResponseService.unknownError(e);
    }
  }


  async a1(): Promise<IApiResponse> {
    return ResponseService.successJson('ok');
  }
}

export const PostmanCtrl = new PostmanController();
