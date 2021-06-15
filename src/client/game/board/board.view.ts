import { IBoardView } from './board.model';
import { IGameScene } from '../views.model';

export class BoardView extends Phaser.GameObjects.Container implements IBoardView {
  scene: IGameScene;

  constructor(scene: IGameScene) {
    super(scene, scene.boardMargin, scene.boardMargin);

    // this.initLegend();

    this.scene.add.existing(this);
  }

  initLegend() {
    this.removeAll();

    this.add(this.scene.letters.map((l, i) =>
      new Phaser.GameObjects.Sprite(this.scene, i * this.scene.cellSize, this.scene.cellSize * 8, 'sprites', `${l}.png`).setOrigin(0)
    ));

    this.add(this.scene.numbers.map((n, i) =>
      new Phaser.GameObjects.Sprite(this.scene, -this.scene.boardMargin, i * this.scene.cellSize, 'sprites', `${n}.png`).setOrigin(0)
    ));
  }
}
