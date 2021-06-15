import { IUserInfo } from '../../models';

export class StoreService {
  freePlayers: Partial<IUserInfo>[];

  constructor() {
    this.freePlayers = [
      {id: '111', userName: 'Test User 1', picture: 'assets/avatar.png', rating: 1234},
      {id: '222', userName: 'Test User 2', picture: 'assets/avatar.png', rating: 1234},
      {id: '333', userName: 'Test User 3', picture: 'assets/avatar.png', rating: 1234},
      {id: '444', userName: 'Test User 4', picture: 'assets/avatar.png', rating: 1234},
    ]
  }
}

export const storeService = new StoreService();
