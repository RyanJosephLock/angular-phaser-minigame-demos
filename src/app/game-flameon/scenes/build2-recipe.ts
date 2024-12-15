import Phaser from 'phaser';

import { Task } from "../model/homework";

export default class Build1Recipe extends Phaser.Scene {
    private nextTask!: Task;

    constructor() {
        super({ key: 'build2-recipe' });
    }

    create() {
        // canvas dimensions
        const { width, height } = this.scale;

        // set click area
        this.add.rectangle(0, 0, width, height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.clickStartBuildPlay());

        // get nextTask
        this.nextTask = this.registry.get('nextTask');
        const homework = this.registry.get('homework')
        console.log(JSON.stringify(this.registry.getAll())); // TESTING ONLY

        // add background
        this.add.image(width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);

        // recipe container
        const recipeContainer = this.add.container().setAlpha(0);

        // add images to container
        const btnRemember = this.add.image(width / 2, 630, 'button-remember').setOrigin(0.5, 0.5);
        recipeContainer.add(btnRemember);
        const imgCircle = this.add.image(width / 2, 1200, 'misc-circle-bg').setOrigin(0.5, 0.5);
        recipeContainer.add(imgCircle);
        const imgCircleShadow = this.add.image(width / 2, 1730, 'misc-circle-shadow').setOrigin(0.5, 0.5);
        recipeContainer.add(imgCircleShadow);
        recipeContainer.add(this.add.image(width / 2, 1630, 'cursive-recipe').setOrigin(0.5, 0.5));
        const imgRecipe = this.add.image(width / 2, 1200, `recipe-${this.nextTask.id}`).setOrigin(0.5, 0.5);
        recipeContainer.add(imgRecipe);

        // add text
        recipeContainer.add(this.add.text(width / 2, 500, `${this.registry.get('nextMenuIem').name}`, { fontFamily: 'PortuguesaCaps', fontSize: '120px', color: '#323843' }).setOrigin(0.5, 0.5));

        // animation
        this.tweens.add({
            targets: recipeContainer,
            alpha: 1,
            duration: 750, 
            ease: 'Quad.easeInOut'
        });
        this.tweens.add({
            targets: imgCircle,
            rotation: 100,
            duration: 300000, 
            repeat: -1
        });
        let objy = imgRecipe?.y || 0;
        this.tweens.add({
            targets: imgRecipe,
            y: objy + 40,
            duration: 1000, 
            ease: 'Quad.easeInOut',
            yoyo: true,
            repeat: -1 
        });

        // hover & tap state
        if (btnRemember) {
            btnRemember.setInteractive();
            btnRemember.on('pointerover', () => {
                this.tweens.add({
                    targets: btnRemember,
                    duration: 300,
                    scale: 0.9,
                    ease: 'Expo.Out'
                });
            });
            btnRemember.on('pointerout', () => {
                this.tweens.add({
                    targets: btnRemember,
                    duration: 1000,
                    scale: 1,
                    ease: 'Elastic.Out'
                });
            });
            btnRemember.on('pointerdown', () => {
                this.clickStartBuildPlay();
            })
        }

    }
    
    private clickStartBuildPlay(): void {
        this.scene.start('build3-play');
    }


}