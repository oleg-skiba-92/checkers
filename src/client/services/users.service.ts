import { apiService } from './api.service';
import { EAPIEndpoints, ILoginRequest, IRegistrationRequest, IUserInfo } from '../../models';
import { Writable, writable } from 'svelte/store';
import { mock, mUser } from '../mock-data';

export class UsersService {
  me: Writable<IUserInfo>;

  constructor() {
    this.me = writable(null);
  }

  getMe(): Promise<IUserInfo> {
    return apiService.get<IUserInfo>([EAPIEndpoints.User, EAPIEndpoints.Me])
      .catch(err => mock(err, mUser))
      .then(res => {
        this.me.set(res);
        return res;
      });
  }

  login(data: ILoginRequest): Promise<IUserInfo> {
    return apiService.post<ILoginRequest, IUserInfo>([EAPIEndpoints.Auth, EAPIEndpoints.Login], data)
      .catch(err => mock(err, mUser))
      .then(res => {
        this.me.set(res);
        return res;
      });
  }

  registration(data: IRegistrationRequest): Promise<IUserInfo> {
    return apiService.post<IRegistrationRequest, IUserInfo>([EAPIEndpoints.Auth, EAPIEndpoints.Registration], data)
      .catch(err => mock(err, mUser))
      .then(res => {
        this.me.set(res);
        return res;
      });
  }
}

export const usersService = new UsersService();
