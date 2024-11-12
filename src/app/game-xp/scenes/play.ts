import { Physics } from 'phaser';
import Stacker from '../objects/stacker';

export default class Play extends Phaser.Scene {
    // private stacker: Stacker | undefined;
    private coffees!: Phaser.Physics.Arcade.Group;
    private ground!: Ground;

    private coffeeStartY: number = -300;


    constructor() {
        super({ key: "play"});
    }

    preload() {}

    create() {
        // this.stacker = new Stacker(this);
        
        // 1. create new collection of coffee images
        // 2. create new ground rectangle

        // 3. apply phsyics to coffee collection
        // 4. apply collision between coffee collection and ground
        // 5. listen for velocity of children in coffee collection, if below 0.1 make object static

        this.coffees = this.physics.add.group({
            // allowGravity: true,
            collideWorldBounds: false,
            maxVelocityY: 500,
            bounceX: 0,
            bounceY: 0
        });

        this.generateCoffees();
        this.generateGround();
        
        this.physics.add.collider(this.coffees, this.coffees);
        this.physics.add.collider(this.coffees, this.ground);

    }

    override update() {
        const coffeesArr = this.coffees.getChildren() as CoffeeItem[];
        
        // Filter to only include enabled coffee items
        // const activeCoffees = coffeesArr.filter(item => !item.disabled);
    
        //activeCoffees.forEach((item, index) => {
        coffeesArr.forEach((item, index) => {
            const body = item.body as Phaser.Physics.Arcade.Body;
            const y = body.position.y;
            const vx = body.velocity.x;
            const vy = body.velocity.y;
            
            if (vy < 100 && y > this.coffeeStartY + 10) {
                // console.log(`coffee ${index + 1} disabled `);
                // body.allowGravity = false;
                // body.moves = false;
                // item.disabled = true; // Mark this item as disabled
                // item.stopPhysics(this);
            }
        });
    }

    private generateCoffees() {
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(2000 * i, () => {
                const item = new CoffeeItem(this, this.coffeeStartY);
                this.coffees.add(item); // Add to group first
    
                const body = item.body as Phaser.Physics.Arcade.Body;
                body.allowGravity = true;
                
            });
        }
    }
    
    private generateGround() {
        this.ground = new Ground(this); 
    }

}

class CoffeeItem extends Phaser.GameObjects.Image {
    // public disabled: boolean = false; // Track if the item is disabled

    constructor(scene: Phaser.Scene, y: number) {
        const x = scene.cameras.main.width / 2;
        super(scene, x, y, 'coffeeCup');

        scene.physics.add.existing(this, false); // add physics to an existing object (because it's instantiated as class)
        scene.add.existing(this); // add object to scene
        
    }

    public stopPhysics(scene: Phaser.Scene) {
        console.log(`set immovable`);
        const body = this.body as Phaser.Physics.Arcade.Body;
        // body.setImmovable(true);
        // body.setGravity(0,0);
        const snapLocation = [this.x, this.y, this.rotation ]
        console.log(snapLocation);
        this.destroy();
        // scene.add.existing(this).setScale(0.1);
        
    }
}

class Ground extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene) {
        const x = scene.cameras.main.width / 2;
        const y = scene.cameras.main.height - 40;
        super(scene, x, y, 400, 20, 0xffffff);
        scene.physics.add.existing(this, true); // true: static
        scene.add.existing(this);
    }
}
