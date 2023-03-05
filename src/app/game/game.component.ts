import { Component, Input, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { MainScene } from './MainScene';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  plops: string ='';

  exclamations =  ['amazing', 'awesome', ' cool', ' amazeballs', ' cool beans', ' nice out of this world', ' terrific', ' cowabunga', ' gee-whizz', 
  ' awesome sauce', ' far-out', ' super-duper', ' tremendous', ' unreal', ' wicked', ' mmm ', 'goshwow', ' fantastic', ' groovy', ' gnarly', ' sweet',
   ' fabulous', ' excellent', ' yay', ' yippee', ' hooray', ' wonderful', ' splendid', ' woot', ' yeah', ' woohoo', ' whoopee', ' fab ', 'whee', ' booyah', 
   ' right on', ' incredible ', 'great', ' yea', ' yes', ' dude ', 'hurray ', 'hurrah', ' huzzah ', 'hoorah', ' alright', 'w00t', ' wahoo', ' tuwhit ', 'tuwhoo', ' whoo'];

  done: boolean|undefined;

  totalTime: number = 0;

  exclamation: string|undefined;

  @Input() 
  playerImage!: string;

  @Input() 
  backgroundImage!: string


  phaserGame: Phaser.Game | undefined;
  config: Phaser.Types.Core.GameConfig;

  constructor(private http: HttpClient) {
    this.config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      input: {
        gamepad: true
    },
      scene: [ MainScene ],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      },
      backgroundColor: '#FFFFFF',
    };
  }
  ngOnInit() {

    this.phaserGame = new Phaser.Game(this.config);
    this.phaserGame.events.addListener('plopCount', (arg: string) => {
      this.plops = arg;
    });

    this.phaserGame.events.addListener('totalTime', (arg: number) => {
      this.totalTime = arg;
    });

    this.phaserGame.events.addListener('destroy', () => {
      this.exclamation = this.exclamations[Math.floor(Math.random() * this.exclamations.length)].toUpperCase();
      this.done = true
    });
    
    this.phaserGame.scene.start('main', {playerImage: this.playerImage, backgroundImage: this.backgroundImage });
  }

  playAgain() {
    window.location.reload();
  }






}
