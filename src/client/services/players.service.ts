import { writable } from 'svelte/store';
import { Writable } from 'svelte/types/runtime/store';
import { ISuggest } from '../../api/features/suggest/suggest.model';
import { IPlayer } from '../../models';
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

  updateInvitesList(invites: ISuggest[]) {
    this.invitesToMe$.set(invites.filter((invite) => invite.to.id === usersService.me.id).map((suggest) => suggest.from))
    this.myInvites$.set(invites.filter((invite) => invite.from.id === usersService.me.id).map((suggest) => suggest.to))
  }
}

export const playersService = new PlayersService();
