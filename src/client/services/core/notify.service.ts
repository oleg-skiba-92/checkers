import { Writable } from 'svelte/types/runtime/store';
import { get, writable } from 'svelte/store';
import { Utils } from '../../libs/utils';
import { ENotifyType, INotify } from '../../models';

class NotifyService {
  notifications$: Writable<INotify[]>;

  private notifyDelay: number = 2000;

  constructor() {
    this.notifications$ = writable([]);
  }

  success(message: string, title: string = 'Success') {
    this.showNotify(ENotifyType.Success, message, title);
  }

  error(message: string, title: string = 'Error') {
    this.showNotify(ENotifyType.Error, message, title);
  }

  warning(message: string, title: string = 'Warning') {
    this.showNotify(ENotifyType.Warning, message, title);
  }


  showNotify(type: ENotifyType, message: string, title: string): void {
    const id =  Utils.randString();
    this.notifications$.set([...(get(this.notifications$)), {type, message, title, id }]);

    setTimeout(() => {
      this.remove(id);
    }, this.notifyDelay)
  }

  remove(id: string): void {
    this.notifications$.set(get(this.notifications$).filter((notification) => notification.id !== id));
  }
}

export const notifyService = new NotifyService();
