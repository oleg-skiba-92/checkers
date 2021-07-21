import { EColor, ITurn } from '../../../models';
import { v4 as uuidv4 } from 'uuid';
import { IRoomEntity, IRoomInfo } from './room.model';
import { IUserEntity } from '../user/user.model';
import { ICheckerCollection } from '../checker/checker.model';
import { CheckerCollection } from '../checker/checker.collection';

export class RoomEntity implements IRoomEntity {
  id: string;
  checkers: ICheckerCollection;

  get info(): IRoomInfo {
    return {
      id: this.id,
      players: this.users.map(u => u.playerData),
      checkers: this.checkers.asString,
    };
  }

  constructor(private users: IUserEntity[]) {
    this.id = uuidv4();
  }

  newGame(): void {
    this.checkers = new CheckerCollection();
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
