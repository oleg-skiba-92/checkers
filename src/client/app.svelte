<script lang="ts">
  import LeftSideBar from './components/left-sidebar.svelte';
  import Game from './components/game.svelte';
  import RightSideBar from './components/right-sidebar.svelte';

  import { socketService, usersService } from './services';
  import { SocketEvents } from '../models';

  usersService.getMe().then(() => {
    socketService.connect();

    socketService.socket.on(SocketEvents.FreePlayerList, (data) => {
      console.log('FreePlayerList', data);
    });

    socketService.socket.on(SocketEvents.SuggestList, (data) => {
      console.log('SuggestList', data);
    });

    socketService.socket.on(SocketEvents.GameStart, (data) => {
      console.log('GameStart', data);
    });
  });
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
