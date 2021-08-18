import { writable } from 'svelte/store';
import { Writable } from 'svelte/types/runtime/store';
import { IInvite, IPlayer } from '../../models';
import { usersService } from './users.service';

class PlayersService {
  freePlayers$: Writable<IPlayer[]>;
  invitesToMe$: Writable<IPlayer[]>
  myInvites$: Writable<IPlayer[]>

  constructor() {
    this.freePlayers$ = writable([]);
    this.invitesToMe$ = writable([]);
    this.myInvites$ = writable([]);
  }

  updateFreePlayerList(players: IPlayer[]) {
    this.freePlayers$.set(players.filter((player) => player.id !== usersService.me.id))
  }

  updateInvitesList(invites: IInvite[]) {
    this.invitesToMe$.set(invites.filter((invite) => invite.to.id === usersService.me.id).map((invite) => invite.from))
    this.myInvites$.set(invites.filter((invite) => invite.from.id === usersService.me.id).map((invite) => invite.to))
  }
}

export const playersService = new PlayersService();
