import Phaser from "phaser"

import Build2Play from "../scenes/build3-play";
import MenuData from "../data/menu-data.json";
import { Menu, Item } from "../model/menu";

export default class BuildManager {
    private scene: Phaser.Scene;
    private clickBody!: Phaser.GameObjects.Rectangle;
    private menu!: Menu;
    private menuItem!: Item;
    private menuItemTitle!: Phaser.GameObjects.Text;
    private menuItemAnswers!: string[];
    private menuItemExtras!: string[];
    private menuItemTurn: string[] = [];
    private menuItemTurnCount: number = 3;
    private menuItemTurnRotateDelay: number = 1000;
    private menuItemResultDelay: number = 2000;
    private cycleImage!: Phaser.GameObjects.Image;
    private cycleStopRotate: Boolean = false;
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
        this.clickBody = this.scene.add.rectangle(0, 0, this.width, this.height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.selectIngredientEvent(this.cycleImage.texture.key));

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
        
        // update stage
        this.menuItemTitle.setText(this.menuItem.name);
        this.createExtraOptions();
        this.createIngredientAnswers();

        // start build
        this.createBuildTurn();
        
    }

    private createExtraOptions() {
        // get valid extras using matching indexs
         const menuItemExtras = this.menuItem.ingredients.filter((ingredient, index) => this.menuItem.extraValid[index] === 1);
         this.menuItemExtras = [ ...menuItemExtras, ...this.menu.extraItems ];
    }

    // build turn of current ingredient
    private createBuildTurn(): void {
        this.createTurnArr(this.menuItemAnswers[0]);
        this.rotateTurnArr();
    }

    // turn array of ingredients to cycle through
    private createTurnArr(answerKey: string): void {
        // add extra wrong answers exc correct answer)
        const menuItemExtrasCopy = this.menuItemExtras.filter(item => item !== answerKey);
        for (let i = 0; i < this.menuItemTurnCount - 1; i++) {
            const randomIndexExtras = Math.floor(Math.random() * menuItemExtrasCopy.length);
            this.menuItemTurn.push(menuItemExtrasCopy.splice(randomIndexExtras, 1)[0]);
        }
        // add correct answer
        const randomIndexAnswer = Math.floor(Math.random() * this.menuItemTurn.length);
        this.menuItemTurn.splice(randomIndexAnswer, 0, answerKey);
        console.log(`Turn: ${this.menuItemTurn}`);           // TESTING ONLY
        console.log(`Answer: ${this.menuItemAnswers[0]}`);   // TESTING ONLY
    }

    private rotateTurnArr(): void {
        this.cycleStopRotate = false;
        let i = 0;
        const cycleNextIngredient = () => {
            i++;
            if (this.cycleStopRotate) {
                return
            }
            if (i === this.menuItemTurn.length) {
                i = 0;
            }
            this.cycleImage.setTexture(this.menuItemTurn[i]);
            this.scene.time.delayedCall(this.menuItemTurnRotateDelay, cycleNextIngredient);
            
        };
        cycleNextIngredient();
    }

    private selectIngredientEvent(textureKey: string): void {
        const isCorrect = this.checkAnswer(textureKey);
        this.dropIngredient(this.contentX, this.contentY + 60, textureKey, isCorrect);
        this.goToNextTurn(isCorrect);
    }
    
    private checkAnswer(textureKey: string): boolean {
        if (this.menuItemAnswers[0] === textureKey) {
            this.menuItemAnswers.shift();
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
            const sceneRef = this.scene as Build2Play
            image.setOnCollide(this.handleActiveIngCollision.bind(sceneRef.buildManager));
            
        }

    private goToNextTurn(isCorrect: boolean): void {
        // hide rotateTurnArr on select
        this.toggleCycleImageSelector(false);

        let resultObj = { 
            'type': '', 
            'textureKey': '',
            'nextFunc': () => {}
        };

        // set result type
        if (this.menuItemAnswers.length != 0 && isCorrect) {
            resultObj = {
               'type': 'correct', 
                'textureKey': 'splash-correct',
                'nextFunc': () => {
                    this.menuItemTurn = [];
                    this.toggleCycleImageSelector(true);
                    this.createBuildTurn();
                }
            };
        } else if (!isCorrect) {
            resultObj = {
                'type': 'wrong', 
                 'textureKey': 'splash-wrong',
                 'nextFunc': () => {
                     this.menuItemTurn = [];
                     this.scene.scene.start('build1-recipe');
                 }
             };
        } else {
            resultObj = {
                'type': 'done', 
                 'textureKey': 'splash-done',
                 'nextFunc': () => {
                     this.menuItemTurn = [];
                     this.scene.scene.start('build1-next');
                 }
             }; 
        }

        // show and animate result image
        const resultTextTemp = this.scene.add.text(this.contentX, this.contentY + 60, resultObj.textureKey).setOrigin(0.5, 0.5);
        const resultImage = this.scene.add.image(this.contentX, this.contentY + 100, resultObj.textureKey);
        console.log(`Result Type: ${JSON.stringify(resultObj.type)}`);       // TESTING ONLY

        // next steps
        this.scene.time.delayedCall(this.menuItemResultDelay, () => {    
            resultTextTemp.destroy();
            resultImage.destroy();
            resultObj.nextFunc();
        });
    }

    private toggleCycleImageSelector(isShow: boolean): void {
        if (isShow) {
            this.cycleImage.setAlpha(1);
            this.clickBody.setInteractive();
            this.cycleStopRotate = false;
        } else {
            this.cycleImage.setAlpha(0);
            this.clickBody.removeInteractive();
            this.cycleStopRotate = true;
        }
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
            
            // left or right force
            const direction = Phaser.Math.Between(0, 1);
            const positionX = direction
                ? this.width
                : 0;
            const positionVec2 = new Phaser.Math.Vector2(positionX, this.height);
            const randomXVelocity = direction 
                ? Phaser.Math.Between(-1.5, -1.0)
                : Phaser.Math.Between(1.0, 1.5);
            const randomYVelocity = Phaser.Math.Between(-2, -2); 
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
        this.createIngredientAnswers();
    }

    private createIngredientAnswers(): void {
        this.menuItemAnswers = [ ...this.menuItem.ingredients ].reverse();
    }
    
}
