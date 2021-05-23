import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {

  private girl!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body; };
  private poopTimer!: Phaser.Time.TimerEvent;
  private plopsText!: Phaser.GameObjects.Text;
  private plops = 0;
  private start = 0;

  constructor() {

    super({ key: 'main' });

  }


  create() {

    this.start = this.time.now;

    const plopSound = this.sound.add('plop');

    var windowWidth = window.innerWidth;
var widnowHeight = window.innerHeight;

    const background = this.add.image(windowWidth / 2, widnowHeight / 2, "home");
    // Based on your game size, it may "stretch" and distort.
    background.setDisplaySize(windowWidth, widnowHeight);


    this.girl = this.add.image(700, 500, 'girl') as any;
    this.girl.scale =  this.cameras.main.height * .001;
    this.physics.add.existing(this.girl);
 
    this.girl.body.setCollideWorldBounds(true);
    console.log('create method');

    this.plopsText = this.add.text(20, 20, 'PLOPS:' + this.plops);
    this.plopsText.setColor('black');

    this.poopTimer = this.time.addEvent({
      delay: 2000,
      callback: () => {
        var poop = this.add.image(Phaser.Math.Between(0, this.cameras.main.worldView.width), 0 ,'poop' );
        poop.scale =  this.cameras.main.height * .0003;
        this.physics.add.existing(poop);

        if(poop.body instanceof Phaser.Physics.Arcade.Body) {
          poop.body.setBounce(.7, .7);

      
          var collider = this.physics.add.collider(this.girl, poop);
          collider.collideCallback = (obj1, obj2) => {

            if (obj1.body.y >= obj2.body.y) {
              plopSound.play();
              var text = this.add.text(obj2.body.x, obj2.body.y, 'PLOP!');
              text.setColor('blue');
              text.setScale(4,4);
              this.time.delayedCall(500, () => {text.destroy()}); 
              this.plops = this.plops + 1;
              this.plopsText.text = 'PLOPS:' + this.plops;
              this.game.events.emit('test', this.plops.toString())
            }
            
            if(this.plops > 100) {
              const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
              const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;


              let end = this.time.now;
              let totalTime = Math.round((end - this.start) / 1000);


              
              const loadingText = 
                this.add.text(
                  screenCenterX, 
                  screenCenterY, 
                  'Wow! ' + totalTime + ' seconds. Reload to play again.', 
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

              loadingText.setColor('green');

              //too many plops. end the game
              this.game.destroy(false);

            }

          };
        }
      },
      loop: true
    });

    this.time.addEvent(
      {
        delay: 10000,
        callback: () => {
          this.poopTimer.timeScale = this.poopTimer.timeScale * 1.5;
        },
        loop: true
      }

    );

  }


  preload() {
    this.load.image('girl', 'assets/girl.png');
    this.load.image('home', 'assets/home.jpg');
    this.load.image('poop', 'assets/poop.png');
    this.load.audio('plop', 'assets/plop.mp3');
    console.log('preload method');
  }


  update() {

    //touch
    var touchPointerX = this.input.pointer1.x;
    if (this.input.pointer1.isDown) {
      this.girl.setX(touchPointerX);
    }

    

    //mouse drag



    //arror keys
    const cursorKeys = this.input.keyboard.createCursorKeys();


    if (cursorKeys.right.isDown) {
      this.girl.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.girl.body.setVelocityX(-500);
    } else {
      this.girl.body.setVelocityX(0);
    }
  }

}
