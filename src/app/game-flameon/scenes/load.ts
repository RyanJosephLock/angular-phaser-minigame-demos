export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: "load" });
    }

    preload() {
        this.load.pack('burger', 'game-xp/assets/burg/burg-asset-pack.json', 'burger');
        // this.load.image('logo', 'game-xp/assets/logo.png');

    }

    create() {
        this.scene.start('play');
    }
}
