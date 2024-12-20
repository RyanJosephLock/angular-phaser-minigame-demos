import Phaser from 'phaser';

import AlignGrid from './../game/align-grid';

export default class Hud extends Phaser.Scene {
    private aGrid!: AlignGrid;
    txtScoreVal!: Phaser.GameObjects.Text;
    score: number = 0;
    countdownText!: Phaser.GameObjects.Text;
    countdown: number = 60;
    width!: number

    constructor(scene: Phaser.Scene) {
        super({ key: 'hud' });
    }

    create() {
        // canvas dimensions
        const { width, height } = this.scale;
        this.width = width;
        const gridConfig = { 'scene': this, 'cols': 11, 'rows': 16, 'width': width, 'height': height }
        this.aGrid = new AlignGrid(gridConfig);
        
        // hud container
        const hudContainer = this.add.container().setPosition(0, -400);

        // add images to container
        hudContainer.add(this.add.image(0, 0, 'misc-top-ui-bg').setOrigin(0.5, 0).setPosition(width / 2, -100));
        this.add.image(0, 0, 'title-logo').setOrigin(1, 1).setPosition(width - 10, height).setScale(0.55);

        // hud text
        hudContainer.add(this.add.text(width / 2 + 120, 50, `SCORE`, { fontFamily: 'PortuguesaCaps', fontSize: '55px', color: '#FFF' }).setAngle(-4));
        hudContainer.add(this.add.text(width / 2 + 130, 230, `HEAT`, { fontFamily: 'PortuguesaCaps', fontSize: '55px', color: '#FFF' }).setAngle(-4));
        this.txtScoreVal = this.add.text(width / 2 + 110, 80, `0`, { fontFamily: 'PortuguesaCaps', fontSize: '155px', color: '#FFF' }).setAngle(-4);
        hudContainer.add(this.txtScoreVal);
        this.countdownText = this.add.text(0, 0, `time left ${this.countdown}`, { fontFamily: 'PortuguesaCaps', fontSize: '75px', color: '#323843' }).setOrigin(0.5, 0.5);

        // position on grid
        this.aGrid.placeAt(5, 4, this.countdownText, undefined, -100);

        // container tween entry
        this.tweens.add({
            targets: hudContainer,
            y: 0,
            duration: 1000, 
            ease: 'Quad.easeInOut',
            onComplete: () => {
                this.addChilliHeatIcon(1);
            } 
        });

        // init score registry (avoid undefined 0 score)
        this.registry.set('score', this.score);

        // score adjust event listener
        const playScene = this.scene.get('build3-play');
        playScene.events.on('scoreAdjust', (scoreAdjust: number) => {
            this.score += scoreAdjust;
            this.txtScoreVal.setText(`${this.score}`);
            this.registry.set('score', this.score);
            this.add.tween({
                targets: this.txtScoreVal,
                y: this.txtScoreVal.y + 10,
                yoyo: true,
                duration: 100
            });
        });

        // heat adjust event listener
        playScene.events.on('heatAdjust', (heat: number) => {
            this.addChilliHeatIcon(heat);
            console.log(`heat ${heat}`);
        });

        // game complete listener
        this.events.on('gameComplete', () => {
            this.goToEndScene();
        });

        // timer
        this.countdownInit();
    }

    private countdownInit(): void {
        const countdownTick = () => {
            this.countdown--;
            if (this.countdown <= 0) {
                this.registry.set('completeMessage', 'Time Up!');
                this.events.emit('gameComplete');
                return;
            } else if (this.countdown <= 10) {
                this.countdownText.setColor('#BC0410').setScale(1.1);
            }
            this.countdownText.setText(`time left  ${this.countdown}`);
            this.time.delayedCall(1000, countdownTick);
        };
        this.time.delayedCall(1000, countdownTick);
    }

    private goToEndScene(): void {
        // stop all scenes and go to end
        this.countdownText.destroy();
        this.scene
            .stop('splash')
            .stop('build1-next')
            .stop('build2-recipe')
            .stop('build3-play')
            .launch('end');
    }

    private addChilliHeatIcon(heat: number): void {
        const posAdjX = (heat - 1) * 40;
        const posAdjY = (heat - 1) * 2;
        const imgChilli = this.add.image(0, 0, 'chilli-pepper')
            .setOrigin(0.5, 0)
            .setPosition(this.width / 2 + 280 + posAdjX, 210 - posAdjY)
            .setAlpha(0)
            .setRotation(0.3)
            .setScale(3);
        this.add.tween({
            targets: imgChilli,
            alpha: 1,
            rotation: 0,
            scale: 1,
            duration: 400,
            ease: 'Bounce.easeOut'
        });
    }
    
}