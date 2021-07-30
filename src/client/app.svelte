<script lang="ts">
  import { writable } from 'svelte/store';

  import LeftSideBar from './components/left-sidebar.svelte';
  import Game from './components/game.svelte';
  import Home from './components/home.svelte';
  import Profile from './components/profile.svelte';
  import RightSideBar from './components/right-sidebar.svelte';
  import FindGame from './components/find-game.svelte';
  import Modal from './components/common/modal.svelte';

  import { gameService, playersService, usersService } from './services';
  import { EPageState } from './models';
  import { routerService, socketService } from './services/core';
  import type { INextTurns, IUserTurn } from '../models';
  import { mockAllData } from './mock-data';

  (<any>window).mockAllData = mockAllData;

  let currentState = routerService.currentState$;
  let room;
  let nextTurns = writable<INextTurns>(null);
  let turns = writable<IUserTurn>(null);

  const initSocket = (token: string) => {
    socketService.connect(token);

    gameService.onFreePlayerListUpdated((data) => {
      console.log('gameService FreePlayerList', data);
      playersService.updateFreePlayerList(data);
    });

    gameService.onInviteListUpdated((data) => {
      console.log('gameService InviteList', data);
      playersService.updateInvitesList(data);
    });

    gameService.onGameStart((roomData, nextTurn) => {
      console.log('gameService GameStart roomData', roomData);
      console.log('gameService GameStart nextTurn', nextTurn);
      room = roomData;
      nextTurns.set(nextTurn);
      routerService.goTo(EPageState.Game);
    });

    gameService.onTurnEnd((userTurn, nextTurn) => {
      console.log('gameService TurnEnd userTurn', userTurn);
      console.log('gameService TurnEnd nextTurn', nextTurn);
      turns.set(userTurn);
      nextTurns.set(nextTurn);
    });
  };

  if (!usersService.token.data) {
    //TODO login
    usersService.loginAsGuest().then((data) => {
      usersService.token.data = data.token;
      initSocket(data.token);
    });
  } else {
    usersService.getMe().then((data: any) => {
      console.log('getMe().then', data);
      initSocket(usersService.token.data);
    });
  }


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
