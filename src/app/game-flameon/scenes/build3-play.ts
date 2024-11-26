import Phaser from 'phaser';

import { Task } from "../model/homework";
import BuildManager from '../game/build-manager';

export default class Build2Play extends Phaser.Scene {
    public buildManager!: BuildManager;
    
    private nextTask!: Task;
    
    constructor() {
        super({ key: 'build3-play' });
    }

    init() {
        this.buildManager = new BuildManager(this);

        // listen for coundownEnd
        this.events.on('countdownEnd', () => {
            this.events.emit('hideHud');
            this.scene.start('end');
        });
    }

    create() {
        // get nextTask
        this.nextTask = this.registry.get('nextTask');

        // systems and managers
        this.buildManager.createBuild(this.nextTask.id);
        
    }

}