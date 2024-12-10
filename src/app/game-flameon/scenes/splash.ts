import Phaser from 'phaser';

import AlignGrid from './../game/align-grid';

export default class Splash extends Phaser.Scene {
    private aGrid!: AlignGrid;
    private gridConfig!: {};

    private width!: number;
    private height!: number;
    
    private titleFlameOn!: Phaser.GameObjects.Image;
    private allBg!: Phaser.GameObjects.Image;
    private circleBg!: Phaser.GameObjects.Image;
    private logo!: Phaser.GameObjects.Image;
    private titleWin!: Phaser.GameObjects.Image;

    private images: Map<string, Phaser.GameObjects.Image> = new Map();

    constructor() {
        super({ key: 'splash' });
    }

    create() {
        // canvas
        const { width, height } = this.scale;
        this.width = width;
        this.height = height;
        
        // alignment grid
        var gridConfig = { 'scene': this, 'cols': 11, 'rows': 11 }
        this.aGrid = new AlignGrid(gridConfig);

        // hide hud (TO DO: WHY NOT WORKING? LIKELY RACE COND)
        this.events.emit('hideHud');

        // add images to map
        this.images.set('bg', this.add.image(0, 0, 'all-bg-high').setOrigin(0, 0));
        this.images.set('circle', this.add.image(0, 0, 'misc-circle-bg').setOrigin(0.5, 0.5));
        this.images.set('logo', this.add.image(0, 0, 'title-logo').setOrigin(0.5, 0.5));
        this.images.set('flameon', this.add.image(0, 0, 'title-flame-on').setOrigin(0.5, 0.5));
        this.images.set('win', this.add.image(0, 0, 'title-win-friends').setOrigin(0.5, 0.5));
        this.images.set('start', this.add.image(0, 0, 'button-start').setOrigin(0.5, 0.5));

        // position on grid
        this.aGrid.placeAt(5, 3, this.images.get('circle'));
        this.aGrid.placeAt(5, 3, this.images.get('logo'), undefined, -200);
        this.aGrid.placeAt(5, 3, this.images.get('flameon'), undefined, 80);
        this.aGrid.placeAt(5, 7, this.images.get('win'), undefined, -20);
        this.aGrid.placeAt(5, 9, this.images.get('start'), undefined, -40);

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
        this.aGrid.placeAt(5, 9, textStartCount, undefined, 50);

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
       
        // show alignment grid
        // this.aGrid.show(0.25);
    }

    private startGame() {
        // this.scene.start('build1-next');
        this.scene.launch('build1-next').launch('hud').remove();
    }

}