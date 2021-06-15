import { ISuggest, ISuggestCollection } from './suggest.model';
import { IPlayer } from '../../../models';

export class SuggestCollection implements ISuggestCollection {
  private _suggests: ISuggest[];

 get list(): ISuggest[] {
   return this._suggests;
 }

  constructor() {
    this._suggests = [];
  }

  has(from: IPlayer, to: IPlayer): boolean {
    return this._suggests.some((suggest) => suggest.from.id === from.id && suggest.to.id === to.id);
  }

  add(from: IPlayer, to: IPlayer) {
    if (!this.has(from, to)) {
      this._suggests.push({from, to});
    }
  }

  remove(from: IPlayer, to: IPlayer) {
    if (this.has(from, to)) {
      let idx = this._suggests.findIndex((suggest) => suggest.from.id === from.id && suggest.to.id === to.id);
      this._suggests.splice(idx, 1);
    }
  }

  removeAllWith(userIds: string[]): void {
    this._suggests = this._suggests
      .filter((suggest) => !userIds.includes(suggest.from.id) && !userIds.includes(suggest.to.id))
  }

  getTo(to: string): ISuggest[] {
    return this._suggests.filter((suggest) => suggest.to.id === to);
  }
}
