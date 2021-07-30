import { EAPIEndpoints } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';
import { usersService } from '../users.service';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export class ApiService {
  private get baseUrl(): string {
    return BASE_SERVER_URL;
  }

  private get authorizationHeader(): {[key: string]: string} {
    if(usersService.token.data) {
      return {'Authorization': `Barer ${usersService.token.data}`}
    }

    return {}
  }

  private buildUrl(urlParts: EAPIEndpoints[]): string {
    return [this.baseUrl, ...urlParts].join('/');
  }

  get<T>(urlParts: EAPIEndpoints[]): Promise<T> {
    return this.request(urlParts, 'GET');
  }

  post<T, R>(urlParts: EAPIEndpoints[], data: T): Promise<R> {
    return this.request(urlParts, 'POST', data);
  }

  private request<T, R>(urlParts: EAPIEndpoints[], method: 'GET' | 'POST', data: T = null): Promise<R> {
    return fetch(this.buildUrl(urlParts), {
      method: method,
      headers: {...JSON_HEADERS, ...this.authorizationHeader},
      mode: "cors",
      body: data === null ? null : JSON.stringify(data),
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // TODO handling error;
          throw new Error(response.statusText);
        }
      });
  }
}

export const apiService = new ApiService();
