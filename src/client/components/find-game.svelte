<script lang="ts">
  import List from './common/list.svelte';
  import { playersService, socketService } from '../services';

  let players = playersService.freePlayers$;
  let myInvites = playersService.myInvites$;

  $: inviteIds = $myInvites.map((suggest) => suggest.id);

  const suggest = (id: string) => {
    socketService.sendSuggest(id);
  };

  const cancelInvite = (id: string) => {
    // TODO implement cancel invite
    console.log('cancel', id);
  };
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-findGame">
  <List
      list={$players}
      title={'Free players ('+$players.length+')'}
      let:id
  >
    <svelte:fragment slot="actions">
      {#if (inviteIds.indexOf(id) === -1)}
        <button
            type="button"
            class="fco-btn fco-btn--orange"
            on:click={() => suggest(id)}
        >Play</button>
      {:else}
        <button
            type="button"
            class="fco-btn fco-btn--red"
            on:click={()=> cancelInvite(id)}
        >Cancel</button>
      {/if}
    </svelte:fragment>
  </List>
</div>
