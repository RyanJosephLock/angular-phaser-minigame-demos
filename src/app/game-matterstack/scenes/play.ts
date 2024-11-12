// import { Physics } from 'phaser';

export default class Play extends Phaser.Scene {
    SPACE: any;
    coffee: any;
    ground: any;

    constructor() {
        super({ key: "play" });
    }

    preload() {}

    create() {
        
        // static coffee cup
        // const item = new CoffeeItem(this);

        this.SPACE = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.ground = this.matter.add.rectangle(200, 300, 400, 30, {
            isStatic: true
        });

        // for(let i = 0; i < 100; i++) {
        //     const x = Phaser.Math.Between(180, 220);
        //     this.time.delayedCall(2000 * i, () => {
        //         this.coffee = this.matter.add.sprite(x, 0, "coffeeCup", 0);
        //     }
        // )}

    }

    override update() {
        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.dropCoffee();
        }
    }

    
    dropCoffee() {
        const x = Phaser.Math.Between(180, 220);
        const coffee = this.matter.add.sprite(x, 0, "coffeeCup", 0);
    }    

}

