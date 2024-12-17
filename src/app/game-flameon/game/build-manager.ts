import Phaser from "phaser"

import AlignGrid from './../game/align-grid';
import Build2Play from "../scenes/build3-play";
import MenuData from "../data/menu-data.json";
import { Menu, Item } from "../model/menu";

export default class BuildManager {
    private aGrid!: AlignGrid;

    private scene: Phaser.Scene;
    private clickBody!: Phaser.GameObjects.Rectangle;
    private menu!: Menu;
    private menuItem!: Item;
    private menuItemTitle!: Phaser.GameObjects.Text;
    private menuItemAnswers!: string[];
    private menuItemExtras!: string[];
    private menuItemTurn: string[] = [];
    private menuItemTurnCount: number = 3;
    private menuItemTurnRotateDelay!: number;
    private menuItemResultDelay: number = 1500;
    private cycleImage!: Phaser.GameObjects.Image;
    private cycleStopRotate: Boolean = false;
    private ingredientGroup!: Phaser.GameObjects.Group;
    private maxHeat: number = 4;
    private explodeToggle: boolean = true;

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
        const gridConfig = { 'scene': this.scene, 'cols': 11, 'rows': 16, 'width': width, 'height': height }
        this.aGrid = new AlignGrid(gridConfig);

        // set stage
        this.setStage();

        // get persistant data
        const data = this.scene.registry.get('menuItemTurnRotateDelay');
        if (data) {
            this.menuItemTurnRotateDelay = data;
        } else {
            this.menuItemTurnRotateDelay = 1000;
        }
    }

    // BUILD OBJECTS

    private setStage() {
        // add background
        this.scene.add.image(this.width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);

        // add images and text
        const buildTapArea = this.scene.add.image(0, 0, 'build-tap-area').setOrigin(0.5, 0.5);
        const btnMake = this.scene.add.image(0, 0, 'button-make').setOrigin(0.5, 0.5);
        this.menuItemTitle = this.scene.add.text(0, 0, ``, { fontFamily: 'PortuguesaCaps', fontSize: '120px', color: '#323843' }).setOrigin(0.5, 0.5);

        // set cycleImage
        this.cycleImage = this.scene.add.image(this.width / 2, 0, '').setAlpha(0).setActive(false);
        
        // set tap area
        this.clickBody = this.scene.add.rectangle(0, 0, this.width, this.height)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => this.selectIngredientEvent(this.cycleImage.texture.key));

        // set ingredient group
        this.ingredientGroup = this.scene.add.group();
            
        // set base
        const y = this.aGrid.getY(14);
        this.scene.matter.add.rectangle(this.width / 2, y, this.width, 200, {
            isStatic: true
            }) as MatterJS.BodyType;

        // align on grid
        this.aGrid.placeAt(5, 4, this.menuItemTitle);
        this.aGrid.placeAt(5, 7, buildTapArea);
        this.aGrid.placeAt(5, 7, this.cycleImage);
        this.aGrid.placeAt(5, 7, btnMake, undefined, -200);

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
        // add extra wrong answers, excluding correct answer
        const menuItemExtrasCopy = this.menuItemExtras.filter(item => item !== answerKey);
        for (let i = 0; i < this.menuItemTurnCount - 1; i++) {
            const randomIndexExtras = Math.floor(Math.random() * menuItemExtrasCopy.length);
            this.menuItemTurn.push(menuItemExtrasCopy.splice(randomIndexExtras, 1)[0]);
        }
        // add correct answer
        const randomIndexAnswer = Math.floor(Math.random() * this.menuItemTurn.length);
        this.menuItemTurn.splice(randomIndexAnswer, 0, answerKey);
    }

    private rotateTurnArr(): void {
        this.cycleStopRotate = false;
        let i = 0;
        // set initial texture
        this.cycleImage.setTexture(this.menuItemTurn[1]);
        // cycle textures
        const cycleNextIngredient = () => {
            i++;
            if (this.cycleStopRotate) {
                return
            }
            if (i === this.menuItemTurn.length) {
                i = 0;
            }
            if (!this.cycleStopRotate) {
                this.cycleImage.setTexture(this.menuItemTurn[i]).setAlpha(1);
                this.scene.add.tween({
                    targets: this.cycleImage,
                    y: this.cycleImage.y + 15,
                    duration: 100,
                    yoyo: true
                })
                this.scene.time.delayedCall(this.menuItemTurnRotateDelay, cycleNextIngredient);
            }
        };
        cycleNextIngredient();
    }

    private selectIngredientEvent(textureKey: string): void {
        const isCorrect = this.checkAnswer(textureKey);
        const y = this.aGrid.getY(7);
        this.dropIngredient(this.width / 2, y, textureKey, isCorrect);
        this.goToNextTurn(isCorrect);
    }
    
    private checkAnswer(textureKey: string): boolean {
        if (this.menuItemAnswers[0] === textureKey) {
            // remove correctly answered item 
            this.menuItemAnswers.shift();
            return true;
        } else {
            return false;
        }
    }
    
    private dropIngredient(x: number, y: number, texture: string, isCorrect: boolean): void {
        const image = this.scene.matter.add.image(x, y, texture, undefined, {
            frictionAir: 0,
            restitution: 1.5,
            shape: {type: 'rectangle', x: 0, y: 20, width: 800, height: 70 }
            })
            .setName(texture)
            .setData({ 'type': 'ingredient', 'isCorrect': isCorrect });
        
        this.ingredientGroup.add(image);
        
        // add collider to active ingredient (manually pass 'this' context)
        const sceneRef = this.scene as Build2Play
        image.setOnCollide(this.handleActiveIngCollision.bind(sceneRef.buildManager));
        
    }

    private goToNextTurn(isCorrect: boolean): void {
        // hide rotateTurnArr on select
        this.toggleCycleImageSelector(false);

        // check if passed score baseline
        let scoreBaselinePassed!: boolean;
        const scoreBaselinePrevious = this.scene.registry.get('scoreBaselinePrevious')  || -1;
        const scoreBaseline = this.scene.registry.get('scoreBaseline') || 0;
        if (scoreBaselinePrevious <= scoreBaseline) {
            scoreBaselinePassed = true;
        } else {
            scoreBaselinePassed = false;
        }

        let resultObj = { 
            'type': '', 
            'text': '',
            'textPos': 0,
            'textureKey': '',
            'textureKeyPos': 0,
            'nextFunc': () => {}
        };

        // set result type
        if (this.menuItemAnswers.length != 0 && isCorrect && scoreBaselinePassed) {
            resultObj = {
                'type': 'correct',
                'text': `+${this.menuItem.ingredientScore}`,
                'textPos': 120,
                'textureKey': 'build-answer-right',
                'textureKeyPos': -250,
                'nextFunc': () => {
                    // add score
                    const ingredientScore = this.menuItem.ingredientScore;
                    this.emitScoreAdjustEvent(ingredientScore);
                    // increment score baseline
                    this.incrementScoreBaseline(scoreBaseline);
                    // build next turn
                    this.menuItemTurn = [];
                    this.toggleCycleImageSelector(true);
                    this.createBuildTurn();
                }
            };
        } else if (this.menuItemAnswers.length != 0 && isCorrect && !scoreBaselinePassed) {
            resultObj = {
                'type': 'redo',
                'text': `+20`,
                'textPos': 100,
                'textureKey': 'build-answer-redo',
                'textureKeyPos': -200,
                'nextFunc': () => {
                    // add score
                    this.emitScoreAdjustEvent(20);
                    // increment score baseline
                    this.incrementScoreBaseline(scoreBaseline);
                    // build next turn
                    this.menuItemTurn = [];
                    this.toggleCycleImageSelector(true);
                    this.createBuildTurn();
                }
            };
        } else if (!isCorrect) {  
            resultObj = {
                'type': 'wrong',
                'text': '',
                'textPos': 0,
                'textureKey': 'build-answer-wrong',
                'textureKeyPos': 0,
                'nextFunc': () => {
                    // record score baseline and reset
                    this.scene.registry.set('scoreBaselinePrevious', scoreBaseline);
                    this.scene.registry.set('scoreBaseline', 0);
                    // go back to recipe
                    this.menuItemTurn = [];
                    this.scene.scene.start('build2-recipe');
                    
                }
             };
        } else {
            resultObj = {
                'type': 'done',
                'text': `+${this.menuItem.finishScore}`,
                'textPos': 120,
                'textureKey': 'build-answer-done',
                'textureKeyPos': -250,
                'nextFunc': () => {
                    this.menuItemTurn = [];
                    this.scene.scene.start('build1-next');
                    this.emitScoreAdjustEvent(this.menuItem.finishScore);
                    this.emitHeatAdjustEvent();
                    // reset score baseline and previous baseline
                    this.scene.registry.set('scoreBaseline', 0);
                    this.scene.registry.set('scoreBaselinePrevious', 0);
                }
             }; 
        }

        // show and animate result image
        const y = this.aGrid.getY(7);
        const resultTextTemp = this.scene.add.text(this.width / 2 + resultObj.textPos, y, resultObj.text, { fontFamily: 'PortuguesaCaps', fontSize: '280px', color: '#BC0410' })
            .setOrigin(0.5, 0.7)
            .setScale(2)
            .setRotation(0.3)
            .setAlpha(0);
        const resultImage = this.scene.add.image(this.width / 2 + resultObj.textureKeyPos, y, resultObj.textureKey)
            .setOrigin(0.5, 0.5)
            .setScale(2)
            .setRotation(-0.3)
            .setAlpha(0);

        this.scene.add.tween({
            targets: resultImage,
            delay: 0,
            alpha: 1,
            scale: 1,
            rotation: 0,
            duration: 200,
            ease: 'Bounce.easeOut'
        });

        this.scene.add.tween({
            targets: resultTextTemp,
            delay: 250,
            alpha: 1,
            scale: 1,
            rotation: 0,
            duration: 200,
            ease: 'Bounce.easeOut'
        });

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
        if (gameObjectB.data.values['type'] === 'ingredient' && !gameObjectB.data.values['isCorrect'] && this.explodeToggle) {
            this.explodeToggle = false; // stops multiple explosions
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
                ? Phaser.Math.Between(-0, -0.5)
                : Phaser.Math.Between(0, 0.5);
            const randomYVelocity = Phaser.Math.Between(-7, -10); 
            const forceVec2 = new Phaser.Math.Vector2(randomXVelocity, randomYVelocity);
        
            // apply the force with a delay (currently no delay between indexs)
            this.scene.time.delayedCall(index * 0, () => {

                // remove restitution bounce
                const imageMjsBody = imageMjs.body as MatterJS.BodyType;
                imageMjsBody.restitution = 0;

                // explode
                imageMjs.applyForceFrom(positionVec2, forceVec2);
                this.scene.time.delayedCall(500, () => {
                    this.resetIngredients();
                });
            });
        });
        this.scene.add.tween({
            targets: ingredientImages,
            alpha: 0,
            delay: 300,
            duration: 200
        });
    }

    private resetIngredients(): void {
        // reset group
        this.ingredientGroup.clear(true, true);
        // reset answers
        this.createIngredientAnswers();
    }

    private createIngredientAnswers(): void {
        this.menuItemAnswers = [ ...this.menuItem.ingredients ].reverse();
    }

    private emitScoreAdjustEvent(scoreAdjust: number): void {
        console.log(this.scene.registry.getAll());
        this.scene.events.emit('scoreAdjust', scoreAdjust);
    }

    private emitHeatAdjustEvent(): void {
        let heat = this.scene.registry.get('heat') || 1;
        if (heat < this.maxHeat) {
            // decrease rotation delay by 80%
            this.menuItemTurnRotateDelay *= 0.8;
            this.scene.registry.set('menuItemTurnRotateDelay', this.menuItemTurnRotateDelay);
            // increment heat
            heat++;
            this.scene.registry.set('heat', heat);
            this.scene.events.emit('heatAdjust', heat);
        }
    }

    private incrementScoreBaseline(scoreBaseline: number): void {
        scoreBaseline++;
        this.scene.registry.set('scoreBaseline', scoreBaseline);
    }
    
}