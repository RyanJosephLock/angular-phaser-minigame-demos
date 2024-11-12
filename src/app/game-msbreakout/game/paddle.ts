import Phaser from "phaser";

export default class Paddle extends Phaser.Physics.Matter.Image 
{
    private ball!: Phaser.Physics.Matter.Image | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: Phaser.Types.Physics.Matter.MatterBodyConfig)
    {
        super(scene.matter.world, x, y, texture, undefined, config); // can access matter world from scene
        this.setData('type', 'paddle');
        scene.add.existing(this); // add this to the display and update list
    }

    attachBall(ball: Phaser.Physics.Matter.Image) 
    {
        this.ball = ball;
        this.ball.x = this.x;
        this.ball.y = this.y - (this.height * 0.5 + this.ball.height * 1);

        // stop ball moving when attached to paddle
        this.ball.setVelocity(0, 0);
    }

    launch()
    {
        if (!this.ball)
        {
            return
        }

        const { width, height } = this.scene.scale
        const x = width * 0.5;
        const y = height * 0.5;

        // ball launch trajectory angle
        const vectorX = x - this.ball.x;
        const vectorY = y - this.ball.y;
        const vector = new Phaser.Math.Vector2(vectorX, vectorY)
            .normalize() // get direct only 
            .scale(8);

        // launch ball
        this.ball.setVelocity(vector.x, vector.y);

        // also detach ball from paddle so position isn't controlled by paddle
        this.ball = undefined;
    }

    override update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        const speed = 7;
        if (cursors?.left.isDown) 
        {
            this.x -= speed;
        } else if (cursors?.right.isDown) 
        {
            this.x += speed;
        }
        
        if (cursors.space.isDown)
        {
            this.launch();
        }

        if (this.ball) {
            this.ball.x = this.x;
        }
    }

}