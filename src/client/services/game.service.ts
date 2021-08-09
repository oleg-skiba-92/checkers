import { INextTurns, IPlayer, IRoom, ITurn, IUserTurn, SocketEvents, TSimpleDataCallback } from '../../models';
import { socketService } from './core';

export class GameService {
  sendInvite(userId: string) {
    socketService.emit(SocketEvents.Invite, userId);
  }

  agreeInvite(userId: string) {
    socketService.emit(SocketEvents.AgreeInvite, userId);
  }

  disagreeInvite(userId: string) {
    socketService.emit(SocketEvents.DisagreeInvite, userId);
  }

  turnEnd(turns: ITurn[], roomId: string) {
    socketService.emit(SocketEvents.TurnEnd, roomId, turns);
  }

  //TODO move TSimpleDataCallback to common
  onFreePlayerListUpdated(fn: TSimpleDataCallback<IPlayer[]>) {
    socketService.subscribe(SocketEvents.FreePlayerList, fn);
  }

  //TODO move IInvite to common
  onInviteListUpdated(fn: TSimpleDataCallback<[]>) {
    socketService.subscribe(SocketEvents.InviteList, fn);
  }

  onGameStart(fn: (roomInfo: IRoom, nextTurns: INextTurns) => void) {
    socketService.subscribe(SocketEvents.GameStart, fn);
  }

  onTurnEnd(fn: (userTurn: IUserTurn, nextTurns: INextTurns) => void) {
    socketService.subscribe(SocketEvents.TurnEnd, fn);
  }
}

export const gameService = new GameService();
