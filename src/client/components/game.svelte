<script lang="ts">
  import { onMount } from 'svelte';

  import { Game } from '../game/game';
  import type { IClientGame } from '../game/game';
  import { usersService } from '../services';
  import type { IRoom, ITurn } from '../../models';
  import { EGameError } from '../../models';
  import { socketService } from '../services/core';

  export let room: IRoom;
  export let nextTurns;//: Writable<INextTurns>;
  export let turns;//: Writable<INextTurns>;

  let showError = (error: EGameError) => {
    console.log('game.svelte showError', error, EGameError[error]);
  };
  let endTurn = (turn: ITurn[]) => {
    socketService.turnEnd(turn, room.id);
  };

  let game: IClientGame;

  onMount(() => {
    game = new Game(usersService.me.id);
    game.afterLoad(() => initGame());
  });

  let initGame = () => {
    game.newGame(room);

    game.onError(showError);
    game.onEndTurn(endTurn);

    nextTurns.subscribe((data) => {
      if (data === null) {
        return;
      }
      game.setNextTurns(data);
    });

    turns.subscribe((data) => {
      if (data === null) {
        return;
      }
      game.outsideTurn(data);
    });
  };
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-game">
  <div id="game"></div>
</div>
