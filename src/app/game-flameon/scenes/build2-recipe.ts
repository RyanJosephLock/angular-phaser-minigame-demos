import Phaser from 'phaser';

import AlignGrid from './../game/align-grid';
import { Task } from "../model/homework";

export default class Build1Recipe extends Phaser.Scene {
    private aGrid!: AlignGrid;
    private objMap: Map<string, Phaser.GameObjects.Image | Phaser.GameObjects.Text> = new Map();
    private nextTask!: Task;

    constructor() {
        super({ key: 'build2-recipe' });
    }

    create() {
        // canvas dimensions
        const { width, height } = this.scale;
        const gridConfig = { 'scene': this, 'cols': 11, 'rows': 16, 'width': width, 'height': height }
        this.aGrid = new AlignGrid(gridConfig);

        // set click area
        this.add.rectangle(0, 0, width, height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.clickStartBuildPlay());

        // get nextTask
        this.nextTask = this.registry.get('nextTask');
        const homework = this.registry.get('homework');

        // add background
        this.add.image(width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);

        // add objects
        this.objMap.set('menu-item-name', this.add.text(0, 0, `${this.registry.get('nextMenuIem').name}`, { fontFamily: 'PortuguesaCaps', fontSize: '120px', color: '#323843' }).setOrigin(0.5, 0.5));
        this.objMap.set('circle', this.add.image(0, 0, 'misc-circle-bg').setOrigin(0.5, 0.5));
        this.objMap.set('button-remember', this.add.image(width / 2, 630, 'button-remember').setOrigin(0.5, 0.5));
        this.objMap.set('circle-shadow', this.add.image(width / 2, 1730, 'misc-circle-shadow').setOrigin(0.5, 0.5));
        this.objMap.set('cursive-recipe', this.add.image(width / 2, 1630, 'cursive-recipe').setOrigin(0.5, 0.5));
        this.objMap.set('recipe', this.add.image(width / 2, 1200, `recipe-${this.nextTask.id}`).setOrigin(0.5, 0.5));

        // position on grid
        this.aGrid.placeAt(5, 4, this.objMap.get('menu-item-name'));
        this.aGrid.placeAt(5, 4, this.objMap.get('button-remember'), undefined, 130);
        this.aGrid.placeAt(5, 9, this.objMap.get('circle'));
        this.aGrid.placeAt(5, 9, this.objMap.get('circle-shadow'), undefined, 600);
        this.aGrid.placeAt(5, 9, this.objMap.get('cursive-recipe'), undefined, 475);
        this.aGrid.placeAt(5, 9, this.objMap.get('recipe'));

        // recipe container
        const recipeContainer = this.add.container().setAlpha(0);
        recipeContainer.add([
            this.objMap.get('menu-item-name') as Phaser.GameObjects.Text,
            this.objMap.get('button-remember') as Phaser.GameObjects.Image,
            this.objMap.get('circle') as Phaser.GameObjects.Image,
            this.objMap.get('circle-shadow') as Phaser.GameObjects.Image,
            this.objMap.get('cursive-recipe') as Phaser.GameObjects.Image,
            this.objMap.get('recipe') as Phaser.GameObjects.Image
        ]);

        // animation
        this.tweens.add({
            targets: recipeContainer,
            alpha: 1,
            duration: 750, 
            ease: 'Quad.easeInOut'
        });
        this.tweens.add({
            targets: this.objMap.get('circle'),
            rotation: 100,
            duration: 300000, 
            repeat: -1
        });

        this.tweens.add({
            targets: this.objMap.get('recipe'),
            y: this.aGrid.getY(9) + 40,
            duration: 1000, 
            ease: 'Quad.easeInOut',
            yoyo: true,
            repeat: -1 
        });

        // hover & tap state
        const btnRemember = this.objMap.get('button-remember');
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