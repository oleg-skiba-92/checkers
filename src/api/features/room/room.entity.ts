import { EColor, ITurn } from '../../../models';
import { v4 as uuidv4 } from 'uuid';
import { IRoomEntity, IRoomInfo } from './room.model';
import { IUserEntity } from '../user/user.model';

export class RoomEntity implements IRoomEntity {
  id: string;

  get info(): IRoomInfo {
    return {
      id: this.id,
      players: this.users.map(u => u.playerData),
    };
  }

  constructor(private users: IUserEntity[]) {
    this.id = uuidv4();
  }

  newGame(): void {
    let randIdx = Math.floor(Math.random() * 2);
    this.users[randIdx].startGame(this.id, EColor.White);
    this.users[+(!randIdx)].startGame(this.id, EColor.Black);
  }

  endGame(): void {
    this.users[0].endGame();
    this.users[1].endGame();
  }

  // TODO
  endTurn(turns: ITurn[]): void {

  }
}
