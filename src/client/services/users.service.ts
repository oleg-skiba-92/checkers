import { apiService, storageService } from './core';
import { EAPIEndpoints, ILoginRequest, IRegistrationRequest, IToken, IUserInfo, IUserInfoWithToken } from '../../models';
import { get, Writable, writable } from 'svelte/store';
import { IStorageModel } from '../models';

export class UsersService {
  me$: Writable<IUserInfo>;

  get me(): IUserInfo {
    return get(this.me$);
  }

  private get token(): IStorageModel<string> {
    return storageService.token;
  }

  constructor() {
    this.me$ = writable(null);
  }

  getMe(): Promise<IUserInfo> {
    return apiService.get<IUserInfo>([EAPIEndpoints.Api, EAPIEndpoints.User, EAPIEndpoints.Me])
      .then(res => {
        this.me$.set(res);
        return res;
      });
  }

  loginAsGuest(): Promise<IUserInfoWithToken> {
    return apiService.post<void, IUserInfoWithToken>([EAPIEndpoints.Auth, EAPIEndpoints.LoginAsGuest], null)
      .then(res => {
        this.me$.set(res.user);
        this.token.data = res.token;
        return res;
      });
  }

  login(data: ILoginRequest): Promise<IUserInfoWithToken> {
    return apiService.post<ILoginRequest, IUserInfoWithToken>([EAPIEndpoints.Auth, EAPIEndpoints.Login], data)
      .then(res => {
        this.me$.set(res.user);
        this.token.data = res.token;
        return res;
      });
  }

  registration(data: IRegistrationRequest): Promise<IUserInfoWithToken> {
    return apiService.post<IRegistrationRequest, IUserInfoWithToken>([EAPIEndpoints.Auth, EAPIEndpoints.Registration], data)
      .then(res => {
        this.me$.set(res.user);
        this.token.data = res.token;
        return res;
      });
  }

  refreshTokenProcess(): Promise<IToken> {
    return apiService.post<IToken, IToken>([EAPIEndpoints.Auth, EAPIEndpoints.RefreshToken], {token: this.token.data})
      .then((res) => {
        this.token.data = res.token;
        return res;
      });
  }
}

export const usersService = new UsersService();
