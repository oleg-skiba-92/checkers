import { apiService } from './api.service';
import { EAPIEndpoints, IUserInfo } from '../../models';
import { Writable, writable } from 'svelte/store';
import { mock, mUser } from '../mock-data';

export class UsersService {
  me: Writable<IUserInfo>;

  constructor() {
    this.me = writable(null);
  }

  getMe() {
    return apiService.get<IUserInfo>([EAPIEndpoints.User, EAPIEndpoints.Me])
      .catch(err => mock(err, mUser))
      .then(res => {
        this.me.set(res);
        return res;
      });
  }
}

export const usersService = new UsersService();
