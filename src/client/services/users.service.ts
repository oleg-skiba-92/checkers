import { apiService } from './api.service';
import { EAPIEndpoints, ILoginRequest, IRegistrationRequest, IUserInfo } from '../../models';
import { get, Writable, writable } from 'svelte/store';

export class UsersService {
  me$: Writable<IUserInfo>;

  get me(): IUserInfo {
    return get(this.me$);
  }

  constructor() {
    this.me$ = writable(null);
  }

  getMe(): Promise<IUserInfo> {
    return apiService.get<IUserInfo>([EAPIEndpoints.User, EAPIEndpoints.Me])
      .then(res => {
        this.me$.set(res);
        return res;
      });
  }

  login(data: ILoginRequest): Promise<IUserInfo> {
    return apiService.post<ILoginRequest, IUserInfo>([EAPIEndpoints.Auth, EAPIEndpoints.Login], data)
      .then(res => {
        this.me$.set(res);
        return res;
      });
  }

  registration(data: IRegistrationRequest): Promise<IUserInfo> {
    return apiService.post<IRegistrationRequest, IUserInfo>([EAPIEndpoints.Auth, EAPIEndpoints.Registration], data)
      .then(res => {
        this.me$.set(res);
        return res;
      });
  }
}

export const usersService = new UsersService();
