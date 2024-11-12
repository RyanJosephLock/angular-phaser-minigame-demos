import Phaser from "phaser"

import MenuData from "../model/menu-data.json";
import { Menu, Item } from "../model/menu";

export default class BuildManager {
    private scene: Phaser.Scene;
    private menu!: Menu;
    private menuItem!: Item;
    private menuItemTitle!: Phaser.GameObjects.Text;
    private cycleImage!: Phaser.GameObjects.Image;
    private ingredientGroup!: Phaser.GameObjects.Group;

    private contentX!: number;
    private contentY!: number;
    private width!: number;
    private height!: number;

    private testingCounter: number = 0; // TESTING ONLY

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.init()
    }

    private init() {
        // import data
        this.menu = MenuData;

        // ingredient spawn position
        const { width, height } = this.scene.scale;
        this.width = width;
        this.height = height;
        this.contentX = this.width / 2;
        this.contentY = 100;

        // set stage
        this.setStage();
    }

    // BUILD OBJECTS

    private setStage() {
        // set title
        this.menuItemTitle = this.scene.add.text(this.contentX, this.contentY, '')
            .setOrigin(0.5, 0.5);

        // set cycleImage
        this.cycleImage = this.scene.add.image(this.contentX, this.contentY + 60, '')
            .setScale(0.5, 0.5)
            .setActive(false);
        
        // set cycleClick
        this.scene.add.rectangle(0, 0, this.width, this.height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.selectIngredient(this.cycleImage.texture.key));

        // set ingredient group
        this.ingredientGroup = this.scene.add.group();
            
        // set base
        this.scene.matter.add.rectangle( this.contentX, this.height - 40, this.width, 80, {
            isStatic: true
            }) as MatterJS.BodyType;

    }

    // BUILD LOGIC

    public createBuild(id: string) {
        this.menuItem = this.menu.menuItems.find(item => item.id === id) as Item;

        // update stage
        this.menuItemTitle.setText(this.menuItem.name);
        this.cycleRotate(this.menuItem.ingredients);
        
    }

    private cycleRotate(images: string[]) {
        if (images.length > 0) {
            const cycleDelay = 400;
            let i = 0; 

            const cycleNextIngredient = () => {
                i++;
                if (i === images.length) {
                    i = 0;
                }
                this.cycleImage.setTexture(images[i]);
                this.scene.time.delayedCall(cycleDelay, cycleNextIngredient);
            };

            cycleNextIngredient();
        }
    
    }

    private selectIngredient(texture: string): void {
        this.dropIngredient(this.contentX, this.contentY + 60, texture);
        
        this.testingCounter++;              // TESTING ONLY
        console.log(this.testingCounter);   // TESTING ONLY
        if(this.testingCounter == 4) {      // TESTING ONLY
            this.explodeIngredients();      // TESTING ONLY
            this.testingCounter = 0;        // TESTING ONLY
        }
    }

    private dropIngredient(x: number, y: number, texture: string): void {
        const image = this.scene.matter.add.image(x, y, texture, undefined, {
            frictionAir: 0,
            restitution: 1.5
            })
            .setScale(0.5, 0.5);
        this.ingredientGroup.add(image);
    }

    private explodeIngredients() {
        console.log('exploding!');  // TESTING ONLY
    
        const ingredientImages = this.ingredientGroup.getChildren();
        ingredientImages.reverse().forEach((image, index) => {
            const imageMjs = image as Phaser.Physics.Matter.Image;
            
            const positionX = Phaser.Math.Between(0, this.width);
            const positionVec2 = new Phaser.Math.Vector2(positionX, this.height);

            const randomXVelocity = Phaser.Math.Between(0, 1) === 0 
                ? Phaser.Math.Between(-3, -2)
                : Phaser.Math.Between(2, 3);
            const randomYVelocity = Phaser.Math.Between(0, -3); 
            const forceVec2 = new Phaser.Math.Vector2(randomXVelocity, randomYVelocity);
        
            // Apply the force with a delay (currently no delay between indexs)
            this.scene.time.delayedCall(index * 0 + 500, () => {
                imageMjs.applyForceFrom(positionVec2, forceVec2);

            });
        });
    }
    
}
