export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: 'load-init'});
    }

    preload() {
        // preload ini images
        this.load.pack('preload', 'flame-on/pack-preload.json', 'preload');

    }

    create() {
        this.scene.start('load-sub');
    }

}
