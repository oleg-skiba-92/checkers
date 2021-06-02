import { IUserInfo } from '../../models/user.model';

export class ApiService {
  private get baseUrl(): string {
    return '/'
  }

  private get apiUrl(): string {
    return `${this.baseUrl}api`
  }


  private get authUrl(): string {
    return `${this.baseUrl}auth`
  }

  me(): Promise<IUserInfo> {
    return fetch(`${this.apiUrl}/me`)
      .then((response) => response.json());
  }

  login(data: { email: string, password: string }) {
    return fetch(`${this.authUrl}/login`, {method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)})
      .then((response) => response.json());
  }

  registration(data: { email: string, password: string, userName: string }) {
    return fetch(`${this.authUrl}/registration`, {method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)})
      .then((response) => response.json());
  }
}
