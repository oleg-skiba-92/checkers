import { EAPIEndpoints, IUserInfo } from '../../models';

export class ApiService {
  private get baseUrl(): string {
    return 'http://localhost:3000';
  }

  private get authUrl(): string {
    return `${this.baseUrl}${EAPIEndpoints.Auth}`;
  }

  private buildUrl(urlParts: EAPIEndpoints[]): string {
    return [this.baseUrl, EAPIEndpoints.Api, ...urlParts].join('/');
  }

  get<T>(urlParts: EAPIEndpoints[]): Promise<T> {
    return fetch(this.buildUrl(urlParts))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // TODO handling error;
          throw new Error(response.statusText);
        }
      });
  }

  post<T, R>(urlParts: EAPIEndpoints[], data: T): Promise<R> {
    return fetch(this.buildUrl(urlParts), {
      method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
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

  login(data: { email: string, password: string }) {
    return fetch(`${this.authUrl}/${EAPIEndpoints.Login}`, {
      method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    })
      .then((response) => response.json());
  }

  registration(data: { email: string, password: string, userName: string }) {
    return fetch(`${this.authUrl}/${EAPIEndpoints.Registration}`, {
      method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    })
      .then((response) => response.json());
  }
}

export const apiService = new ApiService();
