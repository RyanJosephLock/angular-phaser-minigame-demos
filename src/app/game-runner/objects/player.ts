class Player extends Phaser.GameObjects.Rectangle {
    jumping: boolean;
    invincible: boolean;
    health: number;

    constructor(scene: Phaser.Scene, x: number, y: number, number?: number) {
        super(scene, x, y, 32, 32, 0x00ff00);
        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(1);
        const body = this.body as Phaser.Physics.Arcade.Body;  // Cast to Phaser.Physics.Arcade.Body
        body.collideWorldBounds = true;
        body.mass = 10;
        body.setDragY(10);
        this.jumping = false;
        this.invincible = false;
        this.health = 10;
    }
}

export default Player