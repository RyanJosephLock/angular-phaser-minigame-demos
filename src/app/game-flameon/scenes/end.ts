import Phaser from 'phaser';

export default class End extends Phaser.Scene {
    score!: number;

    constructor() {
        super({ key: 'end' });
    }

    create() {
        // show score
        this.score = this.registry.get('score');
        this.add.text(100, 400, `Score: ${this.score}`, { font: '18px Arial', color: '#FFFFFF' });

    }

}