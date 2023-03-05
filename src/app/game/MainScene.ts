import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {

  private player!: Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body; };
  private indicator!: Phaser.GameObjects.Sprite
  private playerImage!: string;
  private backgroundImage !: string;
  private poopTimer!: Phaser.Time.TimerEvent;
  private plopsText!: Phaser.GameObjects.Text;
  private plops = 0;
  private start = 0;

  constructor() {

    super({ key: 'main' });

  }

  init(data: any) {
    this.playerImage = data.playerImage;
    this.backgroundImage = data.backgroundImage;
    console.log(data.playerImage);
  }


  create() {

    this.start = this.time.now;

    const plopSound = this.sound.add('plop');
    const notification = this.sound.add('notification');

    var windowWidth = window.innerWidth;
    var widnowHeight = window.innerHeight;

    this.indicator = this.add.sprite(10,10, 'controller-indicator');
    this.indicator.x = this.indicator.y = 2;

    if (this.input.gamepad.total === 0)
    {
        const text = this.add.text(10, 10, 'Press any button on a connected Gamepad', { font: '16px Courier' });

        this.input.gamepad.once('connected', function (pad: { id: any; }) {

            console.log('connected', pad.id);
            notification.play();

            text.destroy();

        }, this);
    }
    else
    {

    }


    const background = this.add.image(windowWidth / 2, widnowHeight / 2, "background");
    // Based on your game size, it may "stretch" and distort.
    background.setDisplaySize(windowWidth, widnowHeight);


    this.player = this.add.image(700, 500, 'player') as any;
    this.player.scale =  this.cameras.main.height * .001;
    this.physics.add.existing(this.player);
 
    this.player.body.setCollideWorldBounds(true);
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

      
          var collider = this.physics.add.collider(this.player, poop);
          collider.collideCallback = (obj1, obj2) => {

            if (obj1.body.y >= obj2.body.y) {
              plopSound.play();
              var text = this.add.text(obj2.body.x, obj2.body.y, 'PLOP!');
              text.setColor('blue');
              text.setScale(4,4);
              this.time.delayedCall(500, () => {text.destroy()}); 
              this.plops = this.plops + 1;
              this.plopsText.text = 'PLOPS:' + this.plops;
              this.game.events.emit('plopCount', this.plops.toString())
            }
            
            if(this.plops > 9) {
              const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
              const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;


              let end = this.time.now;
              let totalTime = Math.round((end - this.start) / 1000);

              this.game.events.emit('totalTime', totalTime);

              //too many plops. end the game
              this.game.destroy(true, false);

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
    this.load.image('player', this.playerImage);
    this.load.image('background', this.backgroundImage);
    this.load.image('poop', 'assets/poop.png');
    this.load.audio('plop', 'assets/plop.mp3');
    this.load.audio('notification', 'assets/notification.mp3');
    console.log('preload method');
  }


  update() {

    //touch
    var touchPointerX = this.input.pointer1.x;
    if (this.input.pointer1.isDown) {
      this.player.setX(touchPointerX);
    }

    //game controller
    var pads = this.input.gamepad.gamepads;

    for (var i = 0; i < pads.length; i++)
    {
        var gamepad = pads[i];

        if (!gamepad)
        {
            continue;
        }

        if (gamepad.left || gamepad.leftStick.x < 0)
        {
          this.player.body.x-=5;
        }
        else if (gamepad.right || gamepad.leftStick.x > 0)
        {
          this.player.body.x+=5;
        }

        if (gamepad.up)
        {
            this.player.body.y++;
        }
        else if (gamepad.down)
        {
            
        }
        else 
        {
          this.player.body.setVelocityX(0);
        }
    }


    

    //mouse drag



    //arror keys
    const cursorKeys = this.input.keyboard.createCursorKeys();


    if (cursorKeys.right.isDown) {
      this.player.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-500);
    } else {
      this.player.body.setVelocityX(0);
    }
  }

}
