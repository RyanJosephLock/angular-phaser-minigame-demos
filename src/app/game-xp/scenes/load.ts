export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: "load" });
    }

    preload() {
        this.load.pack('stack', 'game-xp/pack.json', 'stack');
        this.load.image('logo', 'game-xp/assets/logo.png');
    }

    create() {
        this.add.image(300, 200, 'coffeeCup').setScale(0.1);
        this.add.image(5, 5, 'logo').setOrigin(0).setScale(0.1);
        this.scene.start('play');
    }
}
