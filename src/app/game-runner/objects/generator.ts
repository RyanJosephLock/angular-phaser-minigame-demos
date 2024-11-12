import Play from '../scenes/play'

export default class Generator {
//     scene: Play;
//     pinos: number;

//     constructor(scene: Play) {
//         this.scene = scene;
//         this.scene.time.delayedCall(2000, () => this.init(), undefined, this);
//         this.pinos = 0;
//     }

//     init() {
//         this.generateCloud();
//         this.generateObstacle();
//         // this.generateCoin();
//     }

//     generateCloud() {
//        j new Cloud(this.scene, 0, 0);
//         this.scene.time.delayedCall(
//             Phaser.Math.Between(2000,3000),
//             () => this.generateCloud(),
//             undefined,
//             this
//         );
//     }

//     generateObstacle() {
//         if(!this.scene.obstacles) { return }
//         this.scene.obstacles.add(
//             new Obstacle(
//                 this.scene,
//                 800,
//                 this.scene.height - Phaser.Math.Between(32, 128)
//             )
//         );
//         this.scene.time.delayedCall(
//             Phaser.Math.Between(1500, 2500),
//             () => this.generateObstacle(),
//             undefined, 
//             this
//         );
//     }

//     generateCoin() {
//         if (!this.scene.coins) { return }
//         this.scene.coins.add(
//             new Coin(
//                 this.scene,
//                 800,
//                 this.scene.height - Phaser.Math.Between(32, 128);
//             )
//         );
//         this.scene.time.delayedCall(
//             Phaser.Math.Between(500, 1500),
//             () => this.generateCoin(),
//             undefined,
//             this
//         )
//     }

// }

// class Cloud extends Phaser.GameObjects.Rectangle {
//     constructor(scene: Phaser.Scene, x: number, y: number) {
//         const finalY = Phaser.Math.Between(0, 100) || y;
//         super(scene, x, finalY, 98, 32, 0xffffff);
//         scene.add.existing(this);
//         const alpha = 1 / Phaser.Math.Between(1, 3);

//         this.setScale(alpha);
//         this.init();
//     }

//     init() {
//         this.scene.tweens.add({
//             targets: this,
//             x: { from: 800, to: -100 },
//             duration: 2000 / this.scale,
//             onComplete: () => {
//                 this.destroy();
//             },
//         });
//     }
// }

// class Obstacle extends Phaser.GameObjects.Rectangle {
//     constructor(scene: Phaser.Scene, x: number, y: number) {
//         super(scene, x, y, 32, 32, 0xff0000);
//         scene.add.existing(this);
//         scene.physics.add.existing(this);
//         if (this.body && 'setAllowGravity' in this.body) {
//             this.body.setAllowGravity(false);
//         }
//         const alpha = 1 / Phaser.Math.Between(1,3);

//         this.init();
//     }

//     init() {
//         this.scene.tweens.add({
//             targets: this,
//             x: { from: 820, to: -100 },
//             duration: 4000,
//             onComplete: () => {
//                 this.destroy();
//             },
//         });
//     }
// }

// class Coin extends Phaser.GameObjects.Sprite {
//     constructor(scene: Phaser.Scene, x: number, y:number) {
//         super(scene, x, y, "coin");
//         scene.add.existing(this);
//         scene.physics.add.existing(this);
//         if (this.body && 'setAllowGravity' in this.body) {
//             this.body.setAllowGravity(false);
//         }
//         const alpha = 1 / Phaser.Math.Between(1, 3);

//         this.init();
//     }

//     init() {
//         this.scene.tweens.add({
//             targets: this,
//             x: { from: 820, to: -100 },
//             duration: 2000,
//             onComplete: () => {
//                 this.destroy();
//             },
//         });

//         const coinAnimation = this.scene.anims.create({
//             key: "coin",
//             frames: this.scene.anims.generateFrameNames("coin", {
//                 start: 0,
//                 end: 7,
//             }),
//             frameRate: 8,
//         });
//         this.play({ key: "coin", repeat: -1 });
//     }
}
