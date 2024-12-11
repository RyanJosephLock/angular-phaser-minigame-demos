import Phaser from 'phaser';

import AlignGrid from './../game/align-grid';

export default class Hud extends Phaser.Scene {
    txtScoreVal!: Phaser.GameObjects.Text;
    score: number = 0;
    level: number = 1;
    countdownText!: Phaser.GameObjects.Text;
    countdown: number = 60;

    constructor(scene: Phaser.Scene) {
        super({ key: 'hud' });
    }

    create() {
        // canvas dimensions
        const { width, height } = this.scale;
        
        // hud container
        const hudContainer = this.add.container().setPosition(0, -400);

        // add images to container
        hudContainer.add(this.add.image(0, 0, 'misc-top-ui-bg').setOrigin(0.5, 0).setPosition(width / 2, -100));
        hudContainer.add(this.add.image(0, 0, 'chilli-pepper').setOrigin(0.5, 0).setPosition(width / 2 + 280, 210));
        this.add.image(0, 0, 'title-logo').setOrigin(1, 1).setPosition(width - 10, height).setScale(0.55);

        // hud text
        hudContainer.add(this.add.text(width / 2 + 120, 50, `SCORE`, { fontFamily: 'PortuguesaCaps', fontSize: '55px', color: '#FFF' }).setAngle(-4));
        hudContainer.add(this.add.text(width / 2 + 130, 230, `HEAT`, { fontFamily: 'PortuguesaCaps', fontSize: '55px', color: '#FFF' }).setAngle(-4));
        this.txtScoreVal = this.add.text(width / 2 + 110, 80, `0`, { fontFamily: 'PortuguesaCaps', fontSize: '155px', color: '#FFF' }).setAngle(-4);
        hudContainer.add(this.txtScoreVal);
        this.countdownText = this.add.text(width / 2, 400, `time left ${this.countdown}`, { fontFamily: 'PortuguesaCaps', fontSize: '75px', color: '#323843' }).setOrigin(0.5, 0.5);

        // container tween entry
        this.tweens.add({
            targets: hudContainer,
            y: 0,
            duration: 1000, 
            ease: 'Quad.easeInOut'
        });

        // init score registry (avoid undefined 0 score)
        this.registry.set('score', this.score);

        // score adjust event listener
        const playScene = this.scene.get('build3-play');
        playScene.events.on('scoreAdjust', (scoreAdjust: number) => {
            this.score += scoreAdjust;
            this.txtScoreVal.setText(`${this.score}`);
            this.registry.set('score', this.score);
        });

        // level adjust event listener
        playScene.events.on('levelAdjust', () => {
            this.level ++;
        });

        // hide hud event listener
        playScene.events.on('hideHud', () => {
            this.scene.setVisible(false);
        });

        // timer
        this.countdownInit();
    }

    private countdownInit(): void {
        const countdownTick = () => {
            this.countdown--;
            this.countdownText.setText(`time left  ${this.countdown}`);
            if (this.countdown > 0) {
                this.time.delayedCall(1000, countdownTick);
            } else {
                // stop all scenes and go to end
                this.scene
                    .stop('splash')
                    .stop('build1-next')
                    .stop('build2-recipe')
                    .stop('build3-play')
                    .start('end');
            }
        };
        this.time.delayedCall(1000, countdownTick);
    }

}