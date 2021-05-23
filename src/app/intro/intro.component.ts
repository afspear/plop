import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  @Output()
  play: EventEmitter<boolean> = new EventEmitter();

  @Output()
  playerImage: EventEmitter<string> = new EventEmitter();

  @Output()
  backgroundImage: EventEmitter<string> = new EventEmitter();

  warning = '';

  constructor() { }

  backgrounds = ["assets/home.jpg", "assets/boom.jpeg", "assets/city.jpeg", "assets/outside.jpeg"];
  players = ["assets/girl.png", "assets/george.png"];
  selectedPlayer = '';
  selectedBackground  = '';

  ngOnInit(): void {
  }

  selectPlayer(player: string) {
    this.selectedPlayer = player;
    this.playerImage.emit(this.selectedPlayer);
    
  }

  selectBackground(background: string) {
    this.selectedBackground = background;
    this.backgroundImage.emit(this.selectedBackground);
  }

  goPlay() {
    if (this.selectedBackground !== '' && this.selectedBackground !== '') {
      this.play.emit(true);
    } else {
      this.warning = 'Gotta pick your player and background 😡';
    }
  }

}
