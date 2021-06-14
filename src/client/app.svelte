<script lang="ts">
  import LeftSideBar from './components/left-sidebar.svelte';
  import Game from './components/game.svelte';
  import RightSideBar from './components/right-sidebar.svelte';
</script>

<!--------------------------------HTML CODE-------------------------------->

<main>
  <div class="fco-left-sidebar-wrapper">
    <LeftSideBar/>
  </div>

  <div class="fco-container">
    <div class="fco-game-wrapper">
      <Game/>
    </div>

    <div class="fco-right-sidebar-wrapper">
      <RightSideBar/>
    </div>
  </div>
</main>
