import { EColor, EDirections } from '../../../models';
import { CHECKER_DIRECTIONS, ICheckerEntity, LETTERS, NUMBERS } from './checker.model';

export class CheckerEntity implements ICheckerEntity {
  private _isQueen: boolean;
  private _color: EColor;
  private _position: string;

  get isQueen(): boolean {
    return this._isQueen;
  }

  get color(): EColor {
    return this._color;
  }

  get opponentColor(): EColor {
    switch (this.color) {
      case EColor.Black:
        return EColor.White;
      case EColor.White:
        return EColor.Black;
    }
  }

  get position(): string {
    return this._position;
  }

  get boardPosition(): string {
    return LETTERS[this._position[0]] + NUMBERS[this._position[1]];
  }

  get directions(): EDirections[] {
    return [...(this._isQueen ? CHECKER_DIRECTIONS.ALL : CHECKER_DIRECTIONS[this.color])];
  }

  constructor(color: EColor, position: string) {
    this._color = color;
    this.setPosition(position);
  }

  setAsQueen() {
    this._isQueen = true;
  }

  setPosition(position) {
    this._position = position;

    if (!this._isQueen
      && (this._color === EColor.White && this._position[1] === '7'
        || this._color === EColor.Black && this._position[1] === '0')) {
      this.setAsQueen();
    }
  }
}

