//#region enums
export enum EColor {
  White = 'white',
  Black = 'black'
}

export enum EDirections {
  RightUp,
  LeftUp,
  RightDown,
  LeftDown,
}

export enum EGameError {
  OpponentTurn,
  NotYourChecker,
  NeedEndTurn,
  CannotTurnHere,
  CannotPossibleTurns,
  BeatMandatory,
}

//#endregion enums

//#region interfaces

export interface ITurn {
  beatPosition?: string,
  turnPosition: string,
  direction: EDirections
}

export interface INextTurns {
  color: EColor;
  beats: ITurn[][];
  turns: ITurn[][];
}

export interface IUserTurn {
  userId: string;
  roomId: string;
  turns: ITurn[];
}

//#endregion interfaces
