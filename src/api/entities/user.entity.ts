import { EColor } from '../../models';
import { ILogger, Logger } from '../libs';

export interface IPlayer {
  id: string;
  userName: string;
  color?: EColor;
}

export interface IUserEntity {
  id: string;
  userName: string;
  socketId: string;
  roomId: string;
  inGame: boolean;
  color: EColor;
  readonly playerData: IPlayer;

  startGame(roomId: string, color: EColor): void;

  endGame(): void;
}

export class UserEntity implements IUserEntity {
  inGame: boolean;
  color: EColor;
  roomId: string;

  private log: ILogger;

  get playerData(): IPlayer {
    return {id: this.id, userName: this.userName, color: this.color};
  }

  constructor(
    public id: string,
    public userName: string,
    public socketId: string,
  ) {
    this.log = new Logger(`UserEntity ${id} - ${userName}`)

    this.inGame = false;
    this.color = null;
  }

  startGame(roomId: string, color: EColor): void {
    this.color = color;
    this.inGame = true;
    this.roomId = roomId;
  }

  endGame(): void {
    this.color = null;
    this.inGame = false;
  }
}
