<script type="ts">
  import {usersService} from '../services/users.service';
  let me = usersService.me;

  
</script>
<!--------------------------------HTML CODE-------------------------------->

<aside class="fco-left-sidebar">
  {#if $me}
  
    <img src="{$me.picture}" alt="avatar">  
    <div class="fco-left-sidebar__title-info-wrapper">
      <div class="fco-left-sidebar__title">{$me.userName}</div>
      <div class="fco-left-sidebar__info">{$me.rating}</div>
    </div>
  {/if} 
  <div class="fco-left-sidebar__button-wrapper"> 
    <img src="assets\settings.svg" alt="avatar">       
    <img src="assets\exit_to_app.svg" alt="avatar"> 
  </div>
</aside>
