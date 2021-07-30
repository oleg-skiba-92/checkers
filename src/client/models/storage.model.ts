export class StorageModel {
  protected _key: string;
  protected _storage: Storage;
  protected _storageType: string;
  protected _isServer: boolean;

  constructor(key: string, isServer: boolean, storage: 'local' | 'session' = 'local') {
    this._key = key;
    this._storageType = storage;
    this._isServer = isServer;
    if (!this._isServer) {
      this._storage = (storage === 'local') ? window.localStorage : window.sessionStorage;
    }
  }

  get data(): any {
    if (this._isServer) {
      return null;
    }
    let data = this._storage.getItem(this._key);
    try {
      data = JSON.parse(data);
    } catch (e) {
    }

    return data;
  }

  set data(data: any) {
    if (typeof data === 'undefined' || this._isServer) {
      return;
    }
    this._storage.setItem(this._key, this._prepareData(data));
  }

  protected _prepareData(data: any): string {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    return data;
  }

  remove(): void {
    if (this._isServer) {
      return;
    }
    this._storage.removeItem(this._key);
  }
}
