import Phaser from 'phaser';

import { Task } from "../model/homework";

export default class Build1Recipe extends Phaser.Scene {
    private contentX!: number;
    private contentY!: number;
    private width!: number;
    private height!: number;
    
    private clickBody!: Phaser.GameObjects.Rectangle;
    private imgRecipe!: Phaser.GameObjects.Image
    private nextTask!: Task;

    constructor() {
        super({ key: 'build2-recipe' });
    }

    init() {
        // content spawn position
        const { width, height } = this.scale;
        this.width = width;
        this.height = height;
        this.contentX = this.width / 2;
        this.contentY = 100;
    }

    create() {
        // set cycleClick
        this.clickBody = this.add.rectangle(0, 0, this.width, this.height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.clickStartBuildPlay());

        // get nextTask
        this.nextTask = this.registry.get('nextTask');

        // display recipe instructions
        this.imgRecipe = this.add.image(this.contentX, this.contentY, this.nextTask.id);
    }
    
    private clickStartBuildPlay(): void {
        this.scene.start('build3-play');
    }


}