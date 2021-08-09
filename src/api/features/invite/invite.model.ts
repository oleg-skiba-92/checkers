import { IPlayer } from '../../../models';

export interface IInviteCollection {
  list: IInvite[];

  has(from: IPlayer, to: IPlayer): boolean;

  add(from: IPlayer, to: IPlayer): void;

  remove(from: IPlayer, to: IPlayer): void;

  removeAllWith(userIds: string[]): void;

  getTo(to: string): IInvite[];
}

export interface IInvite {
  from: IPlayer;
  to: IPlayer;
}
