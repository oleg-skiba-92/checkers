import { IPlayer } from './user.model';

export interface IInvite {
  from: IPlayer;
  to: IPlayer;
}
