import Phaser from 'phaser';

import AlignGrid from './../game/align-grid';

export default class Splash extends Phaser.Scene {
    private aGrid!: AlignGrid;
    private images: Map<string, Phaser.GameObjects.Image> = new Map();


    constructor() {
        super({ key: 'splash' });
    }

    create() {
        // canvas
        const { width, height } = this.scale;
        const gridConfig = { 'scene': this, 'cols': 11, 'rows': 16, 'width': width, 'height': height }
        this.aGrid = new AlignGrid(gridConfig);

        // add bg image
        this.add.image(width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);
        
        // set cycleClick
        this.add.rectangle(0, 0, width, height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => {this.startGame()});

        // add images to map
        this.images.set('circle', this.add.image(0, 0, 'misc-circle-bg').setOrigin(0.5, 0.5));
        this.images.set('logo', this.add.image(0, 0, 'title-logo').setOrigin(0.5, 0.5));
        this.images.set('flameon', this.add.image(0, 0, 'title-flame-on').setOrigin(0.5, 0.5));
        this.images.set('win', this.add.image(0, 0, 'title-win-friends').setOrigin(0.5, 0.5));
        this.images.set('start', this.add.image(0, 0, 'button-start').setOrigin(0.5, 0.5));

        // position on grid
        this.aGrid.placeAt(5, 4, this.images.get('circle'));
        this.aGrid.placeAt(5, 4, this.images.get('logo'), undefined, -200);
        this.aGrid.placeAt(5, 4, this.images.get('flameon'), undefined, 80);
        this.aGrid.placeAt(5, 10, this.images.get('win'), undefined, -20);
        this.aGrid.placeAt(5, 13, this.images.get('start'), undefined, -40);

        // animation
        this.tweens.add({
            targets: this.images.get('circle'),
            rotation: 100,
            duration: 300000, 
            repeat: -1
        });
        let objy = (this.images.get('flameon'))?.y || 0;
        this.tweens.add({
            targets: this.images.get('flameon'),
            y: objy + 40,
            duration: 1000,
            ease: 'Quad.easeInOut',
            yoyo: true,
            repeat: -1 
        });

        // hover & tap state
        const btnStart = this.images.get('start');
        if (btnStart) {
            btnStart.setInteractive();
            btnStart.on('pointerover', () => {
                this.tweens.add({
                    targets: btnStart,
                    duration: 300,
                    scale: 0.9,
                    ease: 'Expo.Out'
                });
            });
            btnStart.on('pointerout', () => {
                this.tweens.add({
                    targets: btnStart,
                    duration: 1000,
                    scale: 1,
                    ease: 'Elastic.Out'
                });
            });
            btnStart.on('pointerdown', () => {
                this.startGame();
            });
        }
    
        // start timer and text
        let startCount = 10;
        const textStartCount = this.add.text(0, 0, `or starting in ${startCount}`, { fontFamily: 'PortuguesaCaps', fontSize: '55px', color: '#000' }).setOrigin(0.5, 0.5);
        this.aGrid.placeAt(5, 13, textStartCount, undefined, 50);

        const startCountTick = () => {
            startCount--;
            textStartCount.setText(`or starting in ${startCount}`);
            if (startCount > 0) {
                this.time.delayedCall(1000, startCountTick);
            } else {
                this.startGame();
            }
        }
        this.time.delayedCall(1000, startCountTick);

    }

    private startGame() {
        this.scene.launch('build1-next').launch('hud').remove();
    }

}