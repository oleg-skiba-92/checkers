export enum SocketEvents {
  SuggestList = 'list:suggest:update',
  FreePlayerList = 'list:freePlayer:update',
  RoomList = 'list:room:update',

  Suggest = 'suggestGame',
  AgreeSuggest = 'suggestGame:agree',
  DisagreeSuggest = 'suggestGame:disagree',
  TurnEnd = 'game:turn',
  GameStart = 'game:start',
  GameEnd = 'game:End',
  Disconnect = 'disconnect',
  UserLeftRoom = 'userLeftRoom',
}
