import { IStorageModel, StorageModel } from '../../models';

class StorageService {
  token: IStorageModel<string>;

  constructor() {
    this.token = new StorageModel<string>('token', false, 'local');
  }
}

export const storageService = new StorageService();
