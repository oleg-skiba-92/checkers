import { IPlayer } from '../../../models';

export interface ISuggestCollection {
  list: ISuggest[];

  has(from: IPlayer, to: IPlayer): boolean;

  add(from: IPlayer, to: IPlayer): void;

  remove(from: IPlayer, to: IPlayer): void;

  removeAllWith(userIds: string[]): void;

  getTo(to: string): ISuggest[];
}

export interface ISuggest {
  from: IPlayer;
  to: IPlayer;
}
