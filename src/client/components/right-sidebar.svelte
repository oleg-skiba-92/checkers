<script lang="ts">
  import List from './common/list.svelte';
  import { gameService, playersService } from '../services';

  let invites = playersService.invitesToMe$;

  const agree = (id: string) => {
    gameService.agreeInvite(id);
  };
  const disagree = (id: string) => {
    gameService.disagreeInvite(id);
  };
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-right-sidebar">
  {#if $invites.length}
    <List
        list={$invites}
        title={'Players want to play with you'}
        let:id
    >
      <svelte:fragment slot="actions">
        <button
            type="button"
            class="fco-btn fco-btn--orange"
            on:click={() => agree(id)}
        >Yes</button>

        <button
            type="button"
            class="fco-btn fco-btn--red"
            on:click={() => disagree(id)}
        >No</button>
      </svelte:fragment>
    </List>
  {/if}
</div>
