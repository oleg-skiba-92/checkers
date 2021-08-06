import { EColor, ITurn } from '../../../models';
import { socketService } from '../../services/core';
import { IUserEntity, IUsersCollection } from '../user/user.model';
import { IRoomsCollection } from '../room/room.model';
import { IInviteCollection } from '../invite/invite.model';
import { UsersCollection } from '../user/users.collection';
import { RoomsCollection } from '../room/rooms.collection';
import { InviteCollection } from '../invite/invite.collection';
import { IAuthData } from '../auth/auth.model';
import { checkerLogic } from '../checker/checker.logic';
import { OPPONENT_COLOR } from '../checker/checker.model';

class GameController {
  private users: IUsersCollection;
  private rooms: IRoomsCollection;
  private invites: IInviteCollection;

  constructor() {
    this.users = new UsersCollection();
    this.rooms = new RoomsCollection();
    this.invites = new InviteCollection();
  }

  userConnected(authData: IAuthData, socketId: string): IUserEntity {
    let user = this.users.create(authData.userId, authData.userName, socketId);

    if(user.inGame) {
      socketService.joinToRooms([socketId], user.roomId);
    }

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

    this.invites.removeAllWith([user.id]);
    this.users.remove(user.id);
    this.updateAllLists();
  }

  newInvite(fromUser: IUserEntity, toUserId: string): void {
    let user = this.users.getById(toUserId);

    if (user) {
      this.invites.add(fromUser, user);
      socketService.updateInviteList(this.invites.list);
    }
  }

  agreeInvite(fromUser: IUserEntity, toUserId: string) {
    let user = this.users.getById(toUserId);

    this.invites.removeAllWith([fromUser.id, toUserId]);

    let room = this.rooms.createRoom([fromUser, user]);
    room.newGame();

    let nextTurns = checkerLogic.getNextTurns(room.checkers, EColor.White);

    socketService.joinToRooms([fromUser.socketId, user.socketId], room.id);
    socketService.startGame(room.info, nextTurns);

    this.updateAllLists();
  }

  disagreeInvite(fromUser: IUserEntity, toUserId: string) {
    let user = this.users.getById(toUserId);

    if (user) {
      this.invites.remove(user, fromUser);
      socketService.updateInviteList(this.invites.list);
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
    socketService.updateInviteList(this.invites.list);
    socketService.updateFreePlayerList(this.users.freePlayers);
    socketService.updateRoomList(this.rooms.list);
  }
}

export const GameCtrl = new GameController();

