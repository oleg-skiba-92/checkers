<script lang="ts">
  import { modalService } from '../../services/core';

  let activeModal = modalService.activeModal$;

  const close = () => {
    modalService.closeActiveModal();
  }
</script>

<!--------------------------------HTML CODE-------------------------------->
{#if $activeModal}
  <div class="fco-modal">
    <div class="fco-modal__backdrop" on:click={close}></div>
    <div class="fco-modal__content">
      <svelte:component this={$activeModal.component}/>
    </div>
  </div>
{/if}
