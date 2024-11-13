import Phaser from "phaser"

import Play from "../scenes/play";
import MenuData from "../model/menu-data.json";
import { Menu, Item } from "../model/menu";

export default class BuildManager {
    private scene: Phaser.Scene;
    private menu!: Menu;
    private menuItem!: Item;
    private menuItemTitle!: Phaser.GameObjects.Text;
    public menuItemIngAnswers!: string[];
    private cycleImage!: Phaser.GameObjects.Image;
    private ingredientGroup!: Phaser.GameObjects.Group;

    private contentX!: number;
    private contentY!: number;
    private width!: number;
    private height!: number;


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
        // get homework
        this.menuItem = this.menu.menuItems.find(item => item.id === id) as Item;
        this.setIngredientAnswers();

        // update stage
        this.menuItemTitle.setText(this.menuItem.name);
        this.cycleRotate(this.menuItem.ingredients);
        
    }

    private cycleRotate(images: string[]) {
        if (images.length > 0) {
            const cycleDelay = 1000;
            let i = 0; 

            const cycleNextIngredient = () => {
                i++;
                if (i === images.length) {
                    i = 0;
                }
                this.cycleImage.setTexture(images[i]);
                this.scene.time.delayedCall(cycleDelay, cycleNextIngredient);

                console.log(`Answer: ${this.menuItemIngAnswers[0]}`);   // TESTING ONLY
            };

            cycleNextIngredient();
        }
    
    }

    private selectIngredient(textureKey: string): void {
        const isCorrect = this.checkAnswer(textureKey);
        this.dropIngredient(this.contentX, this.contentY + 60, textureKey, isCorrect);
    }

    private checkAnswer(textureKey: string): boolean {
        if (this.menuItemIngAnswers[0] === textureKey) {
            this.menuItemIngAnswers.shift();
            return true;
        } else {
            return false;
        }
    }

    private dropIngredient(x: number, y: number, texture: string, isCorrect: boolean): void {
        const image = this.scene.matter.add.image(x, y, texture, undefined, {
            frictionAir: 0,
            restitution: 1.5
            })
            .setName(texture)
            .setScale(0.5, 0.5)
            .setData({ 'type': 'ingredient', 'isCorrect': isCorrect });
        this.ingredientGroup.add(image);
        
        // add collider to active ingredient (manually pass 'this' context)
        const sceneRef = this.scene as Play
        image.setOnCollide(this.handleActiveIngCollision.bind(sceneRef.buildManager));
        
    }

    private handleActiveIngCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData): void {
        // log collision objects
        const { bodyA, bodyB } = data
        const gameObjectA = bodyA.gameObject as Phaser.GameObjects.GameObject;
        const gameObjectB = bodyB.gameObject as Phaser.GameObjects.GameObject;

        // if answer wrong, explode on collision
        if (gameObjectB.data.values['type'] === 'ingredient' && !gameObjectB.data.values['isCorrect']) {
            this.explodeIngredients();
        }

    }

    private explodeIngredients(): void {  
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
        
            // apply the force with a delay (currently no delay between indexs)
            this.scene.time.delayedCall(index * 0, () => {
                imageMjs.applyForceFrom(positionVec2, forceVec2);
                this.scene.time.delayedCall(500, () => {
                    this.resetIngredients();
                });
            });

        });
    }

    private resetIngredients(): void {
        // rest group
        this.ingredientGroup.clear(true, true);
        // reset answers
        this.setIngredientAnswers();
    }

    private setIngredientAnswers(): void {
        console.log('RESET');           // TESTING ONLY
        this.menuItemIngAnswers = [ ...this.menuItem.ingredients ].reverse();
    }

    
}
