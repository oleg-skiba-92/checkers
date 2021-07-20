<script lang="ts">
 import { onMount } from 'svelte';
 import { Game } from '../game/game';
 import type { IRoom } from '../../models';
 import { usersService } from '../services';

 export let room: IRoom

 onMount(() => {
   let game = new Game();

   game.afterLoad(() => {
     game.newGame(room, usersService.me.id);
   })
 })
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-game">
  <div id="game"></div>
</div>
