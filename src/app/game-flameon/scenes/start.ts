import Phaser from 'phaser';

export default class Start extends Phaser.Scene {
    titleFlameOn!: Phaser.GameObjects.Image

    constructor() {
        super({ key: 'start' });
    }

    create() {
        this.titleFlameOn = this.add.image(0, 0, "title-flame-on");
    }

}