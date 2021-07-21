import { EColor } from '../../../models';
import { CheckerEntity } from './checker.entity';
import { BLACK_POSITIONS, ICheckerCollection, ICheckerEntity, LETTERS, NUMBERS, WHITE_POSITIONS } from './checker.model';

export class CheckerCollection implements ICheckerCollection {
  private checkers: ICheckerEntity[];

  get all(): ICheckerEntity[] {
    return this.checkers;
  }

  get whites(): ICheckerEntity[] {
    return this.checkers.filter(checker => checker.color === EColor.White);
  }

  get blacks(): ICheckerEntity[] {
    return this.checkers.filter(checker => checker.color === EColor.Black);
  }

  get allPositions(): string[] {
    return this.checkers.map(checker => checker.position);
  }

  get whitePositions(): string[] {
    return this.whites.map(checker => checker.position);
  }

  get blackPositions(): string[] {
    return this.blacks.map(checker => checker.position);
  }

  get asString(): string {
    return [
      this.whites.map(checker => checker.boardPosition).join(','),
      this.blacks.map(checker => checker.boardPosition).join(',')
    ].join(';');
  }

  constructor() {
    this.reset();
  }

  getByColor(color: EColor): ICheckerEntity[] {
    switch (color) {
      case EColor.White:
        return this.whites;
      case EColor.Black:
        return this.blacks;
      default:
        return [];
    }
  }

  hasChecker(position: string, excludes: string[] = [], color?: EColor): boolean {
    position = this.normalisePosition(position);
    switch (color) {
      case EColor.White:
        return this.whitePositions.filter(p => !excludes.includes(p)).includes(position);
      case EColor.Black:
        return this.blackPositions.filter(p => !excludes.includes(p)).includes(position);
      default:
        return this.allPositions.filter(p => !excludes.includes(p)).includes(position);
    }
  }

  getByPosition(position: string): ICheckerEntity {
    position = this.normalisePosition(position);
    return this.all.find((checker) => checker.position === position);
  }

  reset() {
    this.checkers = [
      ...WHITE_POSITIONS.map(p => new CheckerEntity(EColor.White, p)),
      ...BLACK_POSITIONS.map(p => new CheckerEntity(EColor.Black, p))
    ];
  }

  private normalisePosition(position: string): string {
    if (/^[a-hA-H][1-8]$/.test(position)) {
      return LETTERS[position[0]] + NUMBERS[position[1]];
    }

    if (/^[0-7][0-7]$/.test(position)) {
      return position;
    }

    throw new Error('Invalid Position');
  }
}
