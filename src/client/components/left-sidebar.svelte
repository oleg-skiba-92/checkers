<script lang="ts">
  import List from './list.svelte'
  import { storeService } from '../services/store.service';

  let test = (id:string) => {
    console.log('test clicked', id);
  }
</script>

<aside class="fco-side-bar">
  <List
      list={storeService.freePlayers}
      title={'Вільні гравці'}
      actions={[{label: 'Запропонувати', btnClasses: 'fco-btn__primary', onClick: (id) => test(id)}]}
  />
</aside>
