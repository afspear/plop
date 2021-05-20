import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {

  private square!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body; };
  private circle!: Phaser.GameObjects.Arc ;

  constructor() {

    super({ key: 'main' });


  }


  create() {



    this.square = this.add.rectangle(400, 0, 100, 100, 0xFFFFFF) as any;



    this.physics.add.existing(this.square);
    this.square.body.setCollideWorldBounds(true);

    this.square.body
    console.log('create method');
  }
  preload() {
    console.log('preload method');
  }
  update() {


    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500);
    }
    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}
