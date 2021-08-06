<script lang="ts">
  export let message = 'test message';
  export let title = 'test title';
  export let notifyType = 'error';
</script>

<!--------------------------------HTML CODE-------------------------------->

<div class="fco-notify fco-notify--{notifyType}">
  <div class="fco-notify__icon">
    <img alt={notifyType} src="assets/{notifyType}.svg">
  </div>

  <div class="fco-notify__body">
    <div class="fco-notify__title">{title}</div>
    <div class="fco-notify__message">{message}</div>
  </div>
</div>
