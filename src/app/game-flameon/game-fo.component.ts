import { Component, OnInit } from '@angular/core';
import Phaser from "phaser";
import { StartGame } from './main';

@Component({
  selector: 'app-game-fo',
  standalone: true,
  imports: [],
  template: '<div id="game-container"></div>'
})
export class GameFOComponent implements OnInit {

  game!: Phaser.Game;

  ngOnInit() {
    this.game = StartGame('game-container');
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

}
