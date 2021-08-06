import { EAPIEndpoints, EApiErrorCode } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';
import { usersService } from '../users.service';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
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
      .then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          // NOTE: if refresh token is failed or server has some error trigger invalid token error
          if (urlParts[urlParts.length - 1] === EAPIEndpoints.RefreshToken) {
            // TODO: show error
            return Promise.reject({code: EApiErrorCode.InvalidToken, message: 'InvalidToken'});
          }

          if (response.status === 401) {
            // TODO: show error
            return this.handleUnauthorisedError(response, () => this.request(urlParts, method, data));
          }


          if (response.status === 404) {
            return Promise.reject({code: EApiErrorCode.NotFound, message: 'Not found'});
          }

          // TODO handling error;
          return Promise.reject(response.json());
        }
      });
  }

  private handleUnauthorisedError<R>(response: Response, request: () => Promise<R>): Promise<R> {
    return response.json().then((responseError) => {
      // TODO wtf?
      if (responseError.error && responseError.error.code === EApiErrorCode.TokenExpired) {
        return usersService.refreshTokenProcess().then((res) => request());
      }

      // TODO: show error
      return Promise.reject(responseError);
    });
  }
}

export const apiService = new ApiService();
