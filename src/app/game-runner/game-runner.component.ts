import { Component, OnInit } from '@angular/core';
import Phaser from "phaser";
import { StartGame } from './main'

@Component({
  selector: 'app-game-runner',
  standalone: true,
  imports: [],
  templateUrl: './game-runner.component.html'
})
export class GameRunnerComponent implements OnInit {

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
