<script lang="ts">
  import List from './common/list.svelte'
  import { storeService } from '../services/store.service';

  let test = (id: string) => {
    console.log('test clicked', id);
  }
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-right-sidebar">
  <List
      list={storeService.freePlayers}
      title={'Вільні гравці'}
      actions={[{label: 'Запропонувати', btnClasses: 'fco-btn__primary', onClick: (id) => test(id)}]}
  />
</div>
