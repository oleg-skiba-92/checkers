import 'phaser';

import './scss/index.scss';

import { IUser } from '../models/user.model';
import { IRoom } from '../models/room.model';
import { EColor, ITurn, SocketEvents } from '../models';
import { SocketService, UiService, ApiService } from './services';
import { Game } from './game/game';
import { IPlayer } from '../entities';

window.addEventListener('load', async () => {
  let apiService = new ApiService();
  let ui = new UiService();

  if (window.location.pathname === '/login') {
    ui.initLoginPage((data) => {
      apiService.login(data)
        .then((res) => {
          if (res.error) {
            ui.showLoginFormError(res.message);
          } else {
            window.location.href = '/'
          }
        })
    }, (data) => {
      apiService.registration(data)
        .then((res) => {
          if (res.error) {
            ui.showRegistrationFormError(res.message);
          } else {
            window.location.href = '/'
          }
        })
    })

    return;
  }

  ui.initGamePage();

  let me = await apiService.me();
  let socketService = new SocketService();
  let game = new Game(socketService, ui);

  socketService.socket.on(SocketEvents.FreePlayersUpdate, (users: IUser[]) => {
    ui.updateFreePlayers(users.filter((user) => user.id !== me.id), (userId) => {
      socketService.sendSuggest(userId);
    });
  });

  socketService.socket.on(SocketEvents.SuggestListUpdate, (users: IUser[]) => {
    ui.updateSuggests(users, (userId) => {
      socketService.agreeSuggest(userId);
    }, (userId) => {
      socketService.disagreeSuggest(userId)
    });
  });

  socketService.socket.on(SocketEvents.GameStart, (roomInfo: IRoom) => {
    ui.newGame(roomInfo.players.find((p) => p.id === me.id), roomInfo.players.find((p) => p.id !== me.id));
    game.newGame(roomInfo, me.id);
  });

  // TODO rename color to nextColor
  socketService.socket.on(SocketEvents.TurnEnd, (turns: ITurn[], userId, color) => {
    ui.changeTurnColor(color);

    if (userId !== me.id) {
      game.updateBoard(turns)
    }
  });

  socketService.socket.on(SocketEvents.UserLeftRoom, (player: IPlayer) => {
    ui.showConfirm(`Гравець ${player.userName} вийшов з гри.`, [{
      label: 'ok', className: 'btn--yes', cb: () => {
        ui.hideConfirm();
        ui.endGame();
      }
    }])
  });

  socketService.socket.on(SocketEvents.GameEnd, (player: IPlayer) => {
    ui.showConfirm(`Гравець ${player.userName} виграв.`, [{
      label: 'ok', className: 'btn--yes', cb: () => {
        ui.hideConfirm();
        ui.endGame();
      }
    }])
  })

})
