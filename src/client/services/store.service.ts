import type { IUser } from '../../models/user.model';

export class StoreService {
  freePlayers: IUser[];

  constructor() {
    this.freePlayers = [
      {id: '111', userName: 'Test User 1'},
      {id: '222', userName: 'Test User 2'},
      {id: '333', userName: 'Test User 3'},
      {id: '444', userName: 'Test User 4'},
    ]
  }
}

export const storeService = new StoreService();
