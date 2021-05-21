import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {

  private littleGuy!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body; };
  private balls: Phaser.GameObjects.Arc[] = [];
  private ballTimer!: Phaser.Time.TimerEvent;
  private bonksText!: Phaser.GameObjects.Text;
  private bonks = 0;
  private start = 0;

  constructor() {

    super({ key: 'main' });

  }


  create() {

    this.start = this.time.now;

    this.littleGuy = this.add.image(700, 500, 'little-guy') as any;
    this.littleGuy.scale =  this.cameras.main.height * .001;
    this.physics.add.existing(this.littleGuy);
 
    this.littleGuy.body.setCollideWorldBounds(true);
    console.log('create method');

    this.bonksText = this.add.text(20, 20, 'BONKS:' + this.bonks);
    this.bonksText.setColor('black');

    this.ballTimer = this.time.addEvent({
      delay: 2000,
      callback: () => {
        var ball = this.add.circle(Phaser.Math.Between(0, this.cameras.main.worldView.width) ,0,30, 0x999999 );
        this.physics.add.existing(ball);

        if(ball.body instanceof Phaser.Physics.Arcade.Body) {
          ball.body.setBounce(.7, .7);
          //ball.body.setCollideWorldBounds(true);

          

          var collider = this.physics.add.collider(this.littleGuy, ball);
          collider.collideCallback = (obj1, obj2) => {

            if (obj1.body.y >= obj2.body.y) {
              var text = this.add.text(obj2.body.x, obj2.body.y, 'BONK!');
              text.setColor('blue');
              text.setScale(4,4);
              this.time.delayedCall(500, () => {text.destroy()}); 
              this.bonks = this.bonks + 1;
              this.bonksText.text = 'BONKS:' + this.bonks;
            }
            
            if(this.bonks > 5) {
              const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
              const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;


              let end = this.time.now;
              let totalTime = Math.round((end - this.start) / 1000);


              
              const loadingText = 
                this.add.text(
                  screenCenterX, 
                  screenCenterY, 
                  'That was ' + this.bonks + ' bonks in ' + totalTime + ' seconds. Reload to play again.',  
                  { fontFamily: 'Arial', 
                    fontSize: '64px', 
                    color: '#00ff00', 
                    fontStyle: 'bold', 
                    wordWrap: 
                      {
                        useAdvancedWrap: true, 
                        width: this.cameras.main.width
                      } 
                  }
                ).setOrigin(0.5);

              loadingText.setColor('red');


            

              //too many bonks. end the game
              this.game.destroy(false);

            }

          };
          this.balls.forEach(existingBall => {
            this.physics.add.collider(ball, existingBall);
          });
          this.balls.push(ball);
        }
      },
      loop: true
    });

    this.time.addEvent(
      {
        delay: 10000,
        callback: () => {
          this.ballTimer.timeScale = this.ballTimer.timeScale * 1.5;
        },
        loop: true
      }

    );

  }


  preload() {
    this.load.image('little-guy', 'assets/little-guy.png');
    console.log('preload method');
  }


  update() {

    //touch
    var touchPointerX = this.input.pointer1.x;
    if (this.input.pointer1.isDown) {
      this.littleGuy.setX(touchPointerX);
    }

    

    //mouse drag



    //arror keys
    const cursorKeys = this.input.keyboard.createCursorKeys();


    if (cursorKeys.right.isDown) {
      this.littleGuy.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.littleGuy.body.setVelocityX(-500);
    } else {
      this.littleGuy.body.setVelocityX(0);
    }
  }

  resize ()
  {
      this
  }
}
