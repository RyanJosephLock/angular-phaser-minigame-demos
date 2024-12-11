import HomeworkData from '../data/homework-data.json';

export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: 'load'});
    }

    preload() {
        this.load.pack('misc', 'flame-on/pack-misc.json', 'misc');
        this.load.pack('ing', 'flame-on/pack-ing.json', 'ing');
    }

    create() {
        // set homework data only once
        this.registry.set('homework', HomeworkData);

        // start
        this.scene.start('splash');
    }
}
