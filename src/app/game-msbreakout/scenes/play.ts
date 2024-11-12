import Phaser from 'phaser';

import Paddle from '../game/paddle';

const colors = [
    0xA1E3D8,
    0xEAB8E4,
    0xF9EBAE
]

export default class Play extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private paddle!: Paddle;
    private ball!: Phaser.Physics.Matter.Image;
    private blocks: Phaser.Physics.Matter.Image[] = [];

    private livesLabel!: Phaser.GameObjects.Text;
    private lives = 3;


    constructor() {
        super({ key: "play" });
    }

    init() {
        this.cursors = this.input.keyboard?.createCursorKeys() || undefined;
        
        this.lives = 3;
    }

    preload() {}

    create() {

        // add score
        this.livesLabel = this.add.text(10, 10, `Lives: ${this.lives}`,
            {
                fontSize: 24
            }
        )

        const { width, height } = this.scale // use object destructuring to get width and height from scale
        // ...the above is the same as:
        // const width = this.scale.width;
        // const height = this.scale.height;

        // USE TILED MAP
        const map = this.make.tilemap({ key: 'level1' });
        // match the tile image name with the phaser project image name
        const tileset = map.addTilesetImage('block', 'block');
        

        if (tileset)
        {
            // Add tilemap with images
            map.createLayer('level-layer', tileset, width * 0.25 - (tileset.columns * tileset.tileWidth), 150);
            // Replace each block with a matter gameobject
            map.createFromTiles(1, 0, { key: 'block' })
                ?.map(gameObject => {
                    const block = this.matter.add.gameObject(gameObject, { isStatic: true }) as Phaser.Physics.Matter.Image;
                    block.setData('type', 'block');
                    gameObject.setTint(colors[Phaser.Math.Between(0, colors.length -1)]);
                    this.blocks.push(block);
                    return block;
                })
        }

        // LAYING OUT BLOCKS USING A FOR LOOP (NOT TILED)
        // let x = 128;
        // for(let i = 0; i < 5; i++) 
        // {
        //     // create a block and add data to manage collission easier
        //     const block = this.matter.add.image( x, 200, 'block', undefined, {
        //         isStatic: true
        //     })
        //     .setTint(0x980EC6)
        //     .setData('type', 'block')

        //     this.blocks.push(block);

        //     x += block.width;

        // }


        // create new ball
        this.ball = this.matter.add.image(300, 300, 'ball', undefined,
            {
                circleRadius: 5 // set physics body to circle, not png square
            }
        ).setData('type', 'ball') as Phaser.Physics.Matter.Image;
        this.ball.setBounce(1);
        this.ball.setFriction(0, 0); 
        this.ball.setScale(2);

        const matterBodyType = this.ball.body as MatterJS.BodyType; // cast as BodyType to access MatterJS setters
        this.matter.body.setInertia(matterBodyType, Infinity); // use MatterJS body (not Phaser) to use matter modules if Phaser is missing own wrapper methods

        // create new paddle class instance
        this.paddle = new Paddle(this, width * 0.5, height * 0.9, 'paddle', 
            {
                isStatic: true, // prevent ball from moving paddle
                chamfer: 15 // round the corner of the physics rectangle on paddle so realistic edge bounce
            }
        );
        
        // start ball attached to paddle
        this.paddle.attachBall(this.ball);


        // remove block if collide with block
        // JS scope issue: bind is required because setOnCollide doesn't have a context paramater (usually 'scene'), so need to bind the function to this context
        this.ball.setOnCollide(this.handleBallCollision.bind(this));
        // Also, instead of using bind, we can also use an arrow function to run the function within this class's context


    } 

    // t is the total time since game started and delta time since last frame
    override update(t: number, dt: number) {

        if (this.ball.y > this.scale.height + 100)
        {
            // lose a life and update text object
            this.lives --
            this.livesLabel.text = `Lives: ${this.lives}`;

            if (this.lives == 0)
            {
                this.scene.start('game-over', { title: 'Game Over' });
                return;
            }

            // reset ball on paddle
            this.paddle.attachBall(this.ball);
            return;
        }

        if (this.cursors)
        {
            this.paddle.update(this.cursors);
        }
        
    }

    private handleBallCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData)
    {
        // log collision objects
        const { bodyA, bodyB } = data
        const gameObjectA = bodyA.gameObject as Phaser.GameObjects.GameObject;
        const gameObjectB = bodyB.gameObject as Phaser.GameObjects.GameObject;

        // walls don't have a gameObject, so escape if no object (otherwise error)
        if (!gameObjectA || !gameObjectB)
        {
            return
        }

        // remove block from array
        const idx = this.blocks.findIndex(block => block === gameObjectA)
        if (idx >= 0)
        {
            this.blocks.splice(idx, 1);
            console.dir(this.blocks);
        }

        // log out the preset types of colliding objects
        console.log(`A: ${gameObjectA.getData('type')}, B: ${gameObjectB.getData('type')}`);
        
        // destroy the block
        if(gameObjectA.getData('type') == 'block') {
            gameObjectA.destroy(true); 
        }

        // check win condition
        if (this.blocks.length <= 0)
        {
            console.log(this.blocks);
            this.scene.start('game-over', { title: 'You Win' });
        }
    }

} 

