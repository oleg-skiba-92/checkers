<script lang="ts">
  import { notifyService } from '../../services/core';

  let notifications = notifyService.notifications$;

  const notifyClick = (id: string) => {
    notifyService.remove(id);
  };
</script>

<!--------------------------------HTML CODE-------------------------------->
<div class="fco-notify-wrapper" >
{#each $notifications as notification }
  <div class="fco-notify fco-notify--{notification.type}"
       on:click={() => notifyClick(notification.id)}>
    <div class="fco-notify__icon">
      <img alt={notification.type} src="assets/{notification.type}.svg">
    </div>

    <div class="fco-notify__body">
      <div class="fco-notify__title">{notification.title}</div>
      <div class="fco-notify__message">{notification.message}</div>
    </div>
  </div>
{/each}
</div>
