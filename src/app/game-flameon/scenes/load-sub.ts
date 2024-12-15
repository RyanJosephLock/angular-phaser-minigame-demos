import HomeworkData from '../data/homework-data.json';
import PlayerData from '../data/player-data.json';

export default class Load extends Phaser.Scene {
    constructor() {
        super({ key: 'load-sub'});
    }

    preload() {
        const { width, height } = this.scale;

        // add loading images
        this.add.image(width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);
        const imgLoading = this.add.image(width / 2, height / 2 - 80, 'loading').setOrigin(0.5, 0.5);
        this.add.tween({
            targets: imgLoading,
            rotation: 6000,
            duration: 6000000,
            repeat: -1
        })
        const percentText = this.add.text(width / 2, height / 2 + 60, `0%`, { fontFamily: 'PortuguesaCaps', fontSize: '60px', color: '#323843' }).setOrigin(0.5, 0.5);

        // full asset load
        this.load.pack('misc', 'flame-on/pack-misc.json', 'misc');
        this.load.pack('ing', 'flame-on/pack-ing.json', 'ing');
                
        // load progress
        this.load.on('progress', function (value: number) {
            percentText.setText(`${Math.floor(value * 100)}%`);
        });

    }

    create() {
        // set data only once
        this.registry.set('homework', HomeworkData);
        this.registry.set('players', PlayerData);

        // start
        this.scene.start('splash');
    }

}
