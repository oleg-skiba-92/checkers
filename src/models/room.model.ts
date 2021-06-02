import { EColor } from './game.model';

export interface IRoom {
  id: string;
  isPlaying: boolean;
  players: IRoomPlayer[]
}

export interface IRoomPlayer {
  id: string;
  userName: string;
  color: EColor;
}

export class Room {
  watchers: string[];
  id: string;
  players: IRoomPlayer[];

  constructor(users: any[]) {
    this.id = this.randString();
    this.watchers = [];

    this.players = users.map((user) => ({id: user.id, userName: user.userName, color: null}))
    this.newGame();
  }

  newGame() {
    let randIdx = Math.floor(Math.random() * 2)
    this.players[randIdx].color = EColor.White;
    this.players[+(!randIdx)].color = EColor.Black;
  }

  addUser(userId: string) {
    this.watchers.push(userId);
  }

  removeUser(userId: string) {
    const idx = this.watchers.indexOf(userId);

    if (idx !== -1) {
      this.watchers.splice(idx, 1);
    }
  }


  private randString(len = 10): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randString = '';
    for (let i = 0, n = charset.length; i < len; ++i) {
      randString += charset.charAt(Math.floor(Math.random() * n));
    }
    return randString;
  }

}
