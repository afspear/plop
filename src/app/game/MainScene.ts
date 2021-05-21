import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {

  private littleGuy!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body; };
  private hammer!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body; }[];

  constructor() {

    super({ key: 'main' });

  }


  create() {

    this.littleGuy = this.add.image(700, 500, 'little-guy') as any;
    this.physics.add.existing(this.littleGuy);
 
    this.littleGuy.body.setCollideWorldBounds(true);
    console.log('create method');


    this.time.addEvent({
      delay: 2000,
      callback: () => {
        var ball = this.add.circle(Phaser.Math.Between(100, 700),20,30, 0xFDFDFD );
        this.physics.add.existing(ball);
      },
      repeat: 64
    });

  }


  preload() {
    this.load.image('little-guy', 'assets/little-guy.jpg');
    console.log('preload method');
  }
  update() {


    const cursorKeys = this.input.keyboard.createCursorKeys();


    if (cursorKeys.right.isDown) {
      this.littleGuy.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.littleGuy.body.setVelocityX(-500);
    } else {
      this.littleGuy.body.setVelocityX(0);
    }
  }
}
