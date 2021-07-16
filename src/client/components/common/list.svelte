<script lang="ts">
  import type { IUserInfo } from '../../../models';

  export let list: IUserInfo[]; // TODO interface
  export let title: string;
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-list">
  {#if title}
    <div class="fco-list__title">{title}</div>
  {/if}

  {#each list as item}
    <div class="fco-list__item">
      {#if item.picture}
        <img src="{item.picture}" alt="avatar">
      {:else}
        <img src="../../../assets/avatar.png" alt="avatar">
      {/if}

      <div class="fco-list__title-info-wrapper">
        <div class="fco-list__item-title">{item.userName}</div>
        <div class="fco-list__item-info">{item.rating ? item.rating : '-'}</div>
      </div>

      <div class="fco-list__item-actions">
        <slot id={item.id} name="actions"/>
      </div>
    </div>
  {/each}
</div>
