<script lang="ts">
  import { writable } from 'svelte/store';

  import LeftSideBar from './components/left-sidebar.svelte';
  import Game from './components/game.svelte';
  import Home from './components/home.svelte';
  import Profile from './components/profile.svelte';
  import RightSideBar from './components/right-sidebar.svelte';
  import FindGame from './components/find-game.svelte';
  import Modal from './components/common/modal.svelte';

  import { playersService, usersService } from './services';
  import { EPageState } from './models';
  import { routerService, socketService } from './services/core';
  import { SocketEvents } from '../models';
  import { mockAllData } from './mock-data';

  (<any>window).mockAllData = mockAllData;

  let currentState = routerService.currentState$;
  let room;
  let nextTurns = writable(null);
  let turns = writable(null);

  usersService.getMe().then(() => {
    socketService.connect();

    socketService.socket.on(SocketEvents.FreePlayerList, (data) => {
      console.log('socket.on FreePlayerList', data);
      playersService.updateFreePlayerList(data);
    });

    socketService.socket.on(SocketEvents.InviteList, (data) => {
      console.log('socket.on InviteList', data);
      playersService.updateInvitesList(data);
    });

    socketService.socket.on(SocketEvents.GameStart, (roomData, nextTurn) => {
      console.log('socket.on GameStart roomData', roomData);
      console.log('socket.on GameStart nextTurn', nextTurn);
      room = roomData;
      nextTurns.set(nextTurn);
      routerService.goTo(EPageState.Game);
    });

    socketService.socket.on(SocketEvents.TurnEnd, (userTurn, nextTurn) => {
      console.log('socket.on TurnEnd userTurn', userTurn);
      console.log('socket.on TurnEnd nextTurn', nextTurn);
      turns.set(userTurn);
      nextTurns.set(nextTurn);
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
        <Game room={room} nextTurns="{nextTurns}" turns="{turns}"/>
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
