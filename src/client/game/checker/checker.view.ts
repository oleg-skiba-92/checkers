import { IGameScene, IPoint, TSimpleDataCallback } from '../views.model';
import { EColor } from '../../../models';
import { ICheckerView } from './checker.model';

export class CheckerView extends Phaser.GameObjects.Container implements ICheckerView {
  scene: IGameScene

  private checkerSprite: Phaser.GameObjects.Sprite;
  private queenSprite: Phaser.GameObjects.Sprite;
  private _onClick: TSimpleDataCallback<ICheckerView>;

  constructor(scene: Phaser.Scene, color: EColor, pos: IPoint) {
    super(scene, pos.x, pos.y);

    this._onClick = () => {};

    this.checkerSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'sprites', `${color}-checker.png`).setOrigin(0);
    this.queenSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'sprites', `${color}-queen.png`)
      .setOrigin(0)
      .setAlpha(0);

    this.checkerSprite.setInteractive();

    this.add([this.checkerSprite, this.queenSprite]);
    this.scene.add.existing(this);

    this.checkerSprite.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonReleased()) {
        this._onClick(this);
      }
    });
  }

  onClick<T extends ICheckerView>(fn: TSimpleDataCallback<T>): void {
    if (typeof fn === 'function') {
      this._onClick = fn;
    } else {
      this._onClick = () => {};
    }
  }

  protected move(pos: IPoint) {
    this.scene.add.tween({
      targets: this,
      delay: 0,
      duration: 100,
      props: {
        x: pos.x,
        y: pos.y
      }
    });
    // this.setPosition(pos.x, pos.y)
  }

  protected showQueen() {
    this.queenSprite.setAlpha(1);
  }
}
