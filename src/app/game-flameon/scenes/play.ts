import Phaser from 'phaser';

import HomeworkData from "../model/homework-data.json";
import { Homework, Task } from "../model/homework";
import BuildManager from '../game/build-manager';


export default class Play extends Phaser.Scene {
    private homework!: Homework;
    private buildManager!: BuildManager;

    constructor() {
        super({ key: "play" });
    }

    init() {}

    preload() {
        // import data
        this.homework = HomeworkData;
    }

    create() {
        // systems and managers
        this.buildManager = new BuildManager(this);

        // run experience
        this.startHomework();
    } 

    override update(time: number, delta: number) {}


    // GAME LOOP

    private startHomework(): void {
        const nextTask = this.selectNextTask();
        if (nextTask) {
            this.buildManager.createBuild(nextTask.id);
        } else {
            // handle end of game
        }
    }

    private selectNextTask(): Task | null {
        // find next task in homework
        const nextTask = this.homework.tasks.find(task => task.isDone === false);
        if (nextTask) {
            nextTask.isDone = true;
            return nextTask;
        } else {
            return null;
        }
    }

} 

