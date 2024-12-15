import Phaser from 'phaser';

import { Homework, Task } from "../model/homework";
import { Menu, Item } from "../model/menu";
import MenuData from "../data/menu-data.json";

export default class Build1Next extends Phaser.Scene {
    private menu!: Menu;

    constructor() {
        super({ key: 'build1-next' });
    }

    create() {
        // import data
        this.menu = MenuData;

        // run experience
        this.startHomeworkTask();
    } 

    private startHomeworkTask(): void {
        const nextTask = this.selectNextTask();

        if (nextTask) {
            // lookup menu item for next task
            const nextMenuItem = this.menu.menuItems.find(item => item.id === nextTask.id) as Item;
            // set registry and start scene
            this.registry.set('nextTask', nextTask);
            this.registry.set('nextMenuIem', nextMenuItem);
            this.scene.start('build2-recipe');
        } else {
            // go to end if tasks complete
            this.registry.set('completeMessage', 'All Done!');
            this.scene.get('hud').events.emit('gameComplete');
        }
    }
    
    private selectNextTask(): Task | null {
        // find next task in homework
        const homework: Homework = this.registry.get('homework');
        const nextTask: Task | undefined = homework.tasks.find(task => task.isDone === false);
        if (nextTask) {
            // mark nextTask as done
            nextTask.isDone = true;
            this.registry.set('homework', homework);
            return nextTask;
        } else {
            return null
        }
    }
    
} 

