import { IInviteCollection } from './invite.model';
import { IInvite, IPlayer } from '../../../models';

export class InviteCollection implements IInviteCollection {
  private _invites: IInvite[];

 get list(): IInvite[] {
   return this._invites;
 }

  constructor() {
    this._invites = [];
  }

  has(from: IPlayer, to: IPlayer): boolean {
    return this._invites.some((invite) => invite.from.id === from.id && invite.to.id === to.id);
  }

  add(from: IPlayer, to: IPlayer) {
    if (!this.has(from, to)) {
      this._invites.push({from, to});
    }
  }

  remove(from: IPlayer, to: IPlayer) {
    if (this.has(from, to)) {
      let idx = this._invites.findIndex((invite) => invite.from.id === from.id && invite.to.id === to.id);
      this._invites.splice(idx, 1);
    }
  }

  removeAllWith(userIds: string[]): void {
    this._invites = this._invites
      .filter((invite) => !userIds.includes(invite.from.id) && !userIds.includes(invite.to.id))
  }

  getTo(to: string): IInvite[] {
    return this._invites.filter((invite) => invite.to.id === to);
  }
}
