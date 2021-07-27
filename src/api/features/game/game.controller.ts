import { EColor, ITurn } from '../../../models';
import { socketService } from '../../services/core';
import { IUserEntity, IUsersCollection } from '../user/user.model';
import { IRoomsCollection } from '../room/room.model';
import { ISuggestCollection } from '../suggest/suggest.model';
import { UsersCollection } from '../user/users.collection';
import { RoomsCollection } from '../room/rooms.collection';
import { SuggestCollection } from '../suggest/suggest.collection';
import { IAuthData } from '../auth/auth.model';
import { checkerLogic } from '../checker/checker.logic';
import { OPPONENT_COLOR } from '../checker/checker.model';

class GameController {
  private users: IUsersCollection;
  private rooms: IRoomsCollection;
  private suggests: ISuggestCollection;

  constructor() {
    this.users = new UsersCollection();
    this.rooms = new RoomsCollection();
    this.suggests = new SuggestCollection();
  }

  userConnected(authData: IAuthData, socketId: string): IUserEntity {
    let user = this.users.create(authData.userId, authData.userName, socketId);
    socketService.updateFreePlayerList(this.users.freePlayers);

    return user;
  }

  userDisconnected(user: IUserEntity) {
    if (user.inGame) {
      let room = this.rooms.getById(user.roomId);

      room.endGame();
      socketService.userLeftRoom(user.roomId, user.playerData);
      socketService.leveAllFromRoom(user.roomId);
      // TODO: remove room if all users disconnected
    }

    this.suggests.removeAllWith([user.id]);
    this.users.remove(user.id);
    this.updateAllLists();
  }

  newSuggest(fromUser: IUserEntity, toUserId: string): void {
    let user = this.users.getById(toUserId);

    if (user) {
      this.suggests.add(fromUser, user);
      socketService.updateSuggestList(this.suggests.list);
    }
  }

  agreeSuggest(fromUser: IUserEntity, toUserId: string) {
    let user = this.users.getById(toUserId);

    this.suggests.removeAllWith([fromUser.id, toUserId]);

    let room = this.rooms.createRoom([fromUser, user]);
    room.newGame();

    let nextTurns = checkerLogic.getNextTurns(room.checkers, EColor.White);

    socketService.joinToRooms([fromUser.socketId, user.socketId], room.id);
    socketService.startGame(room.info, nextTurns);

    this.updateAllLists();
  }

  disagreeSuggest(fromUser: IUserEntity, toUserId: string) {
    let user = this.users.getById(toUserId);

    if (user) {
      this.suggests.remove(user, fromUser);
      socketService.updateSuggestList(this.suggests.list);
    }
  }

  turnEnd(fromUser: IUserEntity, roomId: string, turns: ITurn[]) {
    let room = this.rooms.getById(roomId);
    if (!room) {
      return;
    }

    room.endTurn(turns);
    let nextTurns = checkerLogic.getNextTurns(room.checkers, OPPONENT_COLOR[fromUser.color]);

    socketService.endTurn(roomId, {userId: fromUser.id, turns, roomId}, nextTurns);
    if ([...nextTurns.turns, ...nextTurns.beats].length === 0) {
      room.endGame();
      socketService.endGame(roomId, fromUser.playerData);
      socketService.leveAllFromRoom(roomId);
      socketService.updateFreePlayerList(this.users.freePlayers);
      this.rooms.remove(roomId);
    }
  }

  private updateAllLists() {
    socketService.updateSuggestList(this.suggests.list);
    socketService.updateFreePlayerList(this.users.freePlayers);
    socketService.updateRoomList(this.rooms.list);
  }
}

export const GameCtrl = new GameController();

