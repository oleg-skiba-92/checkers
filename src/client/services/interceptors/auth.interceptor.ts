import { storageService } from '../core/storage.service';
import { EApiErrorCode } from '../../../models';
import { IHttpConfigs, IInterceptor, TInterceptorHandler } from '../../models';
import { usersService } from '../users.service';
import { BaseAuthInterceptor } from './base-interceptor';

export class AuthInterceptor extends BaseAuthInterceptor implements IInterceptor {

  private get authorizationHeader(): { [key: string]: string } {
    if (storageService.token.data) {
      return {'Authorization': `Barer ${storageService.token.data}`};
    }

    return {};
  }

  updateParams(httpConfig: IHttpConfigs): IHttpConfigs {
    httpConfig.params.headers = {...httpConfig.params.headers, ...this.authorizationHeader};

    return {
      url: httpConfig.url,
      params: httpConfig.params,
    };
  }

  handleResponse(httpConfig: IHttpConfigs): TInterceptorHandler {
    return async (response: Response) => {
      if (response.ok || httpConfig.url.includes('token')) {
        return response;
      }


      if (response.status === 401) {
        let resp = response.clone();
        let responseError = await resp.json();

        try {
          if (responseError.error && responseError.error === EApiErrorCode.TokenExpired) {
            await usersService.refreshTokenProcess();
            httpConfig.params.headers = {...httpConfig.params.headers, ...this.authorizationHeader};

            return await fetch(httpConfig.url, httpConfig.params);
          }

          throw new Error();
        } catch (e) {
          storageService.token.remove();
          return Promise.reject({error: EApiErrorCode.Unauthorized});
        }
      }

      return response;
    };
  }
}

export const authInterceptor = new AuthInterceptor();
