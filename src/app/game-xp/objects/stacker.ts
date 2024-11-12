enum StackerType {
    flatWhite,
    coldBrew,
    americano
}

// TO DO: IMPLEMENT THIS STACKING SOLUTION - FIXES FALL THROUGH
// https://labs.phaser.io/edit.html?src=src%5Cphysics%5Carcade%5Ccustom%20separate.js
// OR Use my current code and switch an object to static if velocity is lower than a certain speed (i.e < 0.1)

class Stacker extends Phaser.GameObjects.Rectangle {
    private stackerItems!: Phaser.Physics.Arcade.Group;
    private ground!: Ground;

    stackerType!:StackerType;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.init();
    }

    init() {
        // Create a group for the StackerItems
        this.stackerItems = this.scene.physics.add.group({
            allowGravity: true,
            immovable: false
        });

        this.generateGround();
        this.generateStacker();
    }

    private generateStacker() {
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(2000 * i, () => {
                const item = new StackerItem(this.scene);
                this.stackerItems.add(item); // Add item to the group
            });
        }
        
        // Set collision between all items in the group
        this.scene.physics.add.collider(this.stackerItems, this.stackerItems);
        this.scene.physics.add.collider(this.stackerItems, this.ground);
    }

    private generateGround() {
        this.ground = new Ground(this.scene); 
    }
}

class StackerItem extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene) {
        const x = scene.cameras.main.width / 2;
        const y = scene.cameras.main.height / 4;
        super(scene, x, y, 32, 32, 0xffffff);
        scene.physics.add.existing(this, false); // true: false
        scene.add.existing(this);

        // Add physics to this rectangle
        scene.physics.world.enable(this);
        this.body = this.body as Phaser.Physics.Arcade.Body;

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

export default Stacker