import Phaser from 'phaser';

export default class Hud extends Phaser.Scene {
    scoreText!: Phaser.GameObjects.Text;
    score!: number;

    constructor(scene: Phaser.Scene) {
        super({key: 'hud', active: true});

        this.score = 0;
    }

    create() {
        this.scoreText = this.add.text(10, 10, 'Score: 0', { font: '18px Arial', color: '#FFFFFF' });

    }

}