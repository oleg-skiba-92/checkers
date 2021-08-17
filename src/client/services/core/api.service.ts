import { EAPIEndpoints, EApiErrorCode, IApiError } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';
import { usersService } from '../users.service';
import { notifyService } from './notify.service';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const ERROR_MESSAGES = {
  [EApiErrorCode.NotFound]: 'Not Found',
  [EApiErrorCode.NoToken]: 'User is unauthorised',
  [EApiErrorCode.ParseToken]: 'User is unauthorised',
  [EApiErrorCode.InvalidToken]: 'User is unauthorised',
  [EApiErrorCode.Unauthorized]: 'User is unauthorised',
  [EApiErrorCode.InvalidData]: 'Invalid Data',
  [EApiErrorCode.Unknown]: 'Unknown error',
};

// TODO important Circular dependency
// src\client\services\users.service.ts -> src\client\services\core\api.service.ts -> src\client\services\users.service.ts

export class ApiService {
  private get baseUrl(): string {
    return BASE_SERVER_URL;
  }

  private get authorizationHeader(): { [key: string]: string } {
    if (usersService.token.data) {
      return {'Authorization': `Barer ${usersService.token.data}`};
    }

    return {};
  }

  private buildUrl(urlParts: EAPIEndpoints[]): string {
    return [this.baseUrl, ...urlParts].join('/');
  }

  get<T>(urlParts: EAPIEndpoints[]): Promise<T> {
    return this.request<T, null>(urlParts, 'GET');
  }

  post<T, R>(urlParts: EAPIEndpoints[], data: T): Promise<R> {
    return this.request<T, R>(urlParts, 'POST', data);
  }

  // TODO: interceptors
  // FUCK!!!! Refactor this shit!!!!!!!!!!!!!!!!!!!!
  private request<T, R>(urlParts: EAPIEndpoints[], method: 'GET' | 'POST', data: T = null): Promise<R> {
    return fetch(this.buildUrl(urlParts), {
      method: method,
      headers: {...JSON_HEADERS, ...this.authorizationHeader},
      mode: 'cors',
      body: data === null ? null : JSON.stringify(data),
      credentials: 'include'
    })
      .then(async (response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          let errorData: IApiError = await response.json();

          //#region token error
          // NOTE: if refresh token is failed or server has some error trigger Unauthorized error
          if (urlParts[urlParts.length - 1] === EAPIEndpoints.RefreshToken) {
            return Promise.reject(errorData);
          }

          if (response.status === 401) {
            try {
              return await this.handleUnauthorisedError(errorData, () => this.request(urlParts, method, data));
            } catch (e) {
              errorData = e;
            }
          }
          //#endregion

          if (response.status === 404) {
            errorData = {error: EApiErrorCode.NotFound};
          }

          //#region show error
          if ([
            EApiErrorCode.ValidationError
          ].indexOf(errorData.error) === -1) {
            notifyService.error(ERROR_MESSAGES[errorData.error]);
          }
          //#endregion

          return Promise.reject(errorData);
        }
      });
  }

  private handleUnauthorisedError<R>(responseError: IApiError, request: () => Promise<R>): Promise<R> {
    if (responseError.error && responseError.error === EApiErrorCode.TokenExpired) {
      return usersService.refreshTokenProcess()
        .then((res: any) => {
          if (res.error) {
            return Promise.reject();
          }

          return request();
        })
        // NOTE: if refresh token is failed or server has some error trigger Unauthorized error
        .catch((e) => Promise.reject({error: EApiErrorCode.Unauthorized}));
    }

    usersService.token.remove();

    return Promise.reject(responseError);
  }
}

export const apiService = new ApiService();
