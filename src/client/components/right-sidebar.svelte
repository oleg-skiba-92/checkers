<script lang="ts">
  import List from './common/list.svelte';
  import { playersService, socketService } from '../services';

  let suggests = playersService.invitesToMe$;

  const agree = (id: string) => {
    socketService.agreeSuggest(id);
  };
  const disagree = (id: string) => {
    socketService.disagreeSuggest(id);
  };
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-right-sidebar">
  {#if $suggests.length}
    <List
        list={$suggests}
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
