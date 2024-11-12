export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: "load" });
    }

    preload() {
        this.load.pack('stack', 'game-xp/pack.json', 'stack');
        // this.load.image('logo', 'game-xp/assets/logo.png');

        this.load.tilemapTiledJSON('level1', 'game-xp/levels/level1.json');
    }

    create() {
        this.scene.start('play');
    }
}
