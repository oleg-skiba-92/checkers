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

//#endregion interfaces
