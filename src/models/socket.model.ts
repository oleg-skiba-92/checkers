export enum SocketEvents {
  InviteList = 'list:invite:update',
  FreePlayerList = 'list:freePlayer:update',
  RoomList = 'list:room:update',

  Invite = 'inviteGame',
  AgreeInvite = 'inviteGame:agree',
  DisagreeInvite = 'inviteGame:disagree',
  TurnEnd = 'game:turn',
  GameStart = 'game:start',
  GameEnd = 'game:End',
  Disconnect = 'disconnect',
  UserLeftRoom = 'userLeftRoom',
}
