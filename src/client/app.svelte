<script lang="ts">
  import LeftSideBar from './components/left-sidebar.svelte';
  import Game from './components/game.svelte';
  import Home from './components/home.svelte';
  import Profile from './components/profile.svelte';
  import RightSideBar from './components/right-sidebar.svelte';
  import FindGame from './components/find-game.svelte';
  import Modal from './components/common/modal.svelte';

  import { EPageState } from './models';
  import { playersService, routerService, socketService, usersService } from './services';
  import { SocketEvents } from '../models';
  import { mockAllData } from './mock-data';

  (<any>window).mockAllData = mockAllData

  let currentState = routerService.currentState$;
  let room;

  usersService.getMe().then(() => {
    socketService.connect();

    socketService.socket.on(SocketEvents.FreePlayerList, (data) => {
      console.log('FreePlayerList', data);
      playersService.updateFreePlayerList(data)
    });

    socketService.socket.on(SocketEvents.SuggestList, (data) => {
      console.log('SuggestList', data);
      playersService.updateInvitesList(data)
    });

    socketService.socket.on(SocketEvents.GameStart, (data) => {
      console.log('GameStart', data);
      room = data;
      routerService.goTo(EPageState.Game);
    });
  });
</script>

<!--------------------------------HTML CODE-------------------------------->

<main>
  <div class="fco-left-sidebar-wrapper">
    <LeftSideBar/>
  </div>

  <div class="fco-container">
    <div class="fco-content-wrapper">
      {#if $currentState === EPageState.Home}
        <Home/>
      {:else if $currentState === EPageState.Profile}
        <Profile/>
      {:else if $currentState === EPageState.Game}
        <Game room={room}/>
      {:else if $currentState === EPageState.FindGame}
        <FindGame/>
      {/if}
    </div>

    <div class="fco-right-sidebar-wrapper">
      <RightSideBar/>
    </div>
  </div>
</main>

<Modal/>
