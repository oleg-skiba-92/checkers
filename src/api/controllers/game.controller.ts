import {
  IRoomsCollection,
  ISuggestCollection,
  IUsersCollection,
  RoomsCollection,
  SuggestCollection,
  UsersCollection
} from '../collections';
import { IAuthData, ITurn } from '../../models';
import { IUserEntity } from '../entities';
import { socketService } from '../services/core';

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

    socketService.joinToRooms([fromUser.socketId, user.socketId], room.id);
    socketService.startGame(room.info);

    this.updateAllLists();
  }

  disagreeSuggest(fromUser: IUserEntity, toUserId: string) {
    let user = this.users.getById(toUserId);

    if (user) {
      this.suggests.remove(user, fromUser);
      socketService.updateSuggestList(this.suggests.list);
    }
  }

  turnEnd(fromUser: IUserEntity, roomId: string, turns: ITurn[], isWin: boolean) {
    let room = this.rooms.getById(roomId);

    if (room) {
      room.endTurn(turns)
      socketService.endTurn(roomId, turns, fromUser.id, fromUser.color);
      if (isWin) {
        room.endGame();
        socketService.endGame(roomId, fromUser.playerData);
        socketService.leveAllFromRoom(roomId);
        socketService.updateFreePlayerList(this.users.freePlayers);
        this.rooms.remove(roomId);
      }
    }
  }

  private updateAllLists() {
    socketService.updateSuggestList(this.suggests.list);
    socketService.updateFreePlayerList(this.users.freePlayers);
    socketService.updateRoomList(this.rooms.list);
  }
}

export const GameCtrl = new GameController();

