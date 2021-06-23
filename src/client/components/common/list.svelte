<script lang="ts">
  import type { IUserInfo } from '../../../models';

  export let list: IUserInfo[]; // TODO interface
  export let title: string;
  // TODO btnClasses to btnTypeEnum
  export let actions: { label: string; btnClasses: string; onClick: (id: string) => void }[] = [];
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-list">
  {#if title}
    <div class="fco-list__title">{title}</div>
  {/if}

  {#each list as item}
    <div class="fco-list__item">
      
        <img src="{item.picture}" alt="avatar">

        <div class="fco-list__title-info-wrapper">
          <div class="fco-list__item-title">{item.userName}</div>
          <div class="fco-list__item-info">{item.rating}</div>
        </div>
        
      {#if actions.length}
        <div class="fco-list__item-actions">
          {#each actions as action}
            <button
                type="button"
                class="fco-btn {action.btnClasses}"
                on:click={action.onClick(item.id)}
            >{action.label}</button>           
          {/each}
        </div>
      {/if}

    </div>
  {/each}
</div>
