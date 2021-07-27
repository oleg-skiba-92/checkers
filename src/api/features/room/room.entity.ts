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
    // this.users.find(u => u.id === '962958a3-eadb-42dd-8c48-75b601f1e6e2').startGame(this.id, EColor.White);
    // this.users.find(u => u.id !== '962958a3-eadb-42dd-8c48-75b601f1e6e2').startGame(this.id, EColor.Black);
    this.users[randIdx].startGame(this.id, EColor.White);
    this.users[+(!randIdx)].startGame(this.id, EColor.Black);
  }

  endGame(): void {
    this.users[0].endGame();
    this.users[1].endGame();
  }

  endTurn(turns: ITurn[]): void {
    if (!turns || turns.length <= 1) {
      throw Error('Incorrect turns in endTurn method');
    }

    for (let i = 1; i < turns.length; i++) {
      this.checkers.moveChecker(turns[i - 1].turnPosition, turns[i].turnPosition);

      if (turns[i].beatPosition) {
        this.checkers.deleteChecker(turns[i].beatPosition);
      }
    }
  }
}
