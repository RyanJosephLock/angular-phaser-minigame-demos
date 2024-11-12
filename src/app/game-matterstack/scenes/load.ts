export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: "load" });
    }

    preload() {
        this.load.pack('stack', 'game-xp/pack.json', 'stack');
        this.load.image('logo', 'game-xp/assets/logo.png');
    }

    create() {
        this.scene.start('play');
    }
}
