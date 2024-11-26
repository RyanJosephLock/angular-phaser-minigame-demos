import Phaser from 'phaser';

export default class Hud extends Phaser.Scene {
    scoreText!: Phaser.GameObjects.Text;
    score: number = 0;
    levelText!: Phaser.GameObjects.Text;
    level: number = 1;
    countdownText!: Phaser.GameObjects.Text;
    countdown: number = 60;

    constructor(scene: Phaser.Scene) {
        super({key: 'hud', active: true});
    }

    create() {
        // add hud visuals
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { font: '18px Arial', color: '#FFFFFF' });
        this.levelText = this.add.text(10, 40, `Level: ${this.level}`, { font: '18px Arial', color: '#FFFFFF' });
        this.countdownText = this.add.text(200, 10, `${this.countdown}`, { font: '18px Arial', color: '#FFFFFF' });
        
        // init score registry (avoid undefined 0 score)
        this.registry.set('score', this.score);

        // score adjust event listener
        const playScene = this.scene.get('build3-play');
        playScene.events.on('scoreAdjust', (scoreAdjust: number) => {
            this.score += scoreAdjust;
            this.scoreText.setText(`Score: ${this.score}`);
            this.registry.set('score', this.score);
        });

        // level adjust event listener
        playScene.events.on('levelAdjust', () => {
            this.level ++;
            this.levelText.setText(`Level: ${this.level}`);
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
            this.countdownText.setText(`${this.countdown}`);
            if (this.countdown > 0) {
                this.time.delayedCall(1000, countdownTick);
            } else {
                // stop all scenes and go to end
                this.scene
                    .stop('build1-next')
                    .stop('build2-recipe')
                    .stop('build3-play')
                    .start('end');
            }
        };
        this.time.delayedCall(1000, countdownTick);
    }

}