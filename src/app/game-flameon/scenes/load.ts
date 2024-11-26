import HomeworkData from "../data/homework-data.json";

export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: "load"});
    }

    preload() {
        this.load.pack('burger', 'game-xp/assets/burg/burg-asset-pack.json', 'burger');
    }

    create() {
        // set homework data only once
        this.registry.set('homework', HomeworkData);
        this.scene.start('build1-next');
    }
}
