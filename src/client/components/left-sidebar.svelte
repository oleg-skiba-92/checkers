<script lang="ts">
  import type { IUserInfo } from '../../../models';

  export let list: IUserInfo[]; // TODO interface
  export let title: string;
  // TODO btnClasses to btnTypeEnum
  export let actions: { label: string; btnClasses: string; onClick: (id: string) => void }[] = [];
</script>

<!--------------------------------HTML CODE-------------------------------->

<aside class="fco-left-sidebar">
  left-sidebar component



      <img src="{item.picture}" alt="avatar">

      <div class="fco-list__title-info-wrapper">
        <div class="fco-list__item-title">{item.userName}</div>
        <div class="fco-list__item-info">{item.rating}</div>
      </div>
    
</aside>
