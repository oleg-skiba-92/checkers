import { EColor, TSimpleDataCallback } from '../../../models'
import { ICellView } from './cell.model';
import { IGameScene, IPoint } from '../game.model';

export class CellView extends Phaser.GameObjects.Container implements ICellView {
  scene: IGameScene;

  private cellSprite: Phaser.GameObjects.Sprite;
  private outline: Phaser.GameObjects.Rectangle;
  private _onClick: TSimpleDataCallback<ICellView>;

  constructor(scene: IGameScene, color: EColor, pos: IPoint) {
    super(scene, pos.x, pos.y);

    this._onClick = () => {};

    this.outline = this.scene.add.rectangle(1, 1, scene.cellSize-2, scene.cellSize-2).setOrigin(0).setAlpha(0);
    this.cellSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'sprites', `${color}-cell.png`).setOrigin(0);
    this.cellSprite.setInteractive();

    this.add([this.cellSprite, this.outline]);
    this.scene.add.existing(this);

    this.cellSprite.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonReleased()) {
        this._onClick(this);
      }
    });

  }


  onClick<T extends ICellView>(fn: TSimpleDataCallback<T>): void {
    if (typeof fn === 'function') {
      this._onClick = fn;
    } else {
      this._onClick = () => {};
    }
  }

  highlightOff() {
    this.outline.setAlpha(0);
  }

  protected highlightOn(color: number) {
    this.outline.setAlpha(1);
    this.outline.setStrokeStyle(2, color);
  }
}
