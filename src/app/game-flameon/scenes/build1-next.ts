import Phaser from 'phaser';

import { Homework, Task } from "../model/homework";
import BuildManager from '../game/build-manager';


export default class Build1Next extends Phaser.Scene {
    private homework!: Homework;
    public buildManager!: BuildManager;

    constructor() {
        super({ key: 'build1-next' });
    }

    create() {
        // run experience
        this.startHomeworkTask();
    } 

    private startHomeworkTask(): void {
        const nextTask = this.selectNextTask();

        if (nextTask) {
            // set nextTask in registry and start scene
            this.registry.set('nextTask', nextTask);
            this.scene.start('build1-recipe');
        } else {
            this.endGame();
        }
    }
    
    private selectNextTask(): Task | null {
        // find next task in homework
        const homework: Homework = this.registry.get('homework');
        const nextTask: Task | undefined = homework.tasks.find(task => task.isDone === false);
        if (nextTask) {
            // mark nextTask as done
            nextTask.isDone = true;
            this.registry.set('homeowrk', homework);
            return nextTask;
        } else {
            return null
        }
    }
    
    private endGame() {
        console.log(`end the game`);        // TESTING ONLY
    }
} 

