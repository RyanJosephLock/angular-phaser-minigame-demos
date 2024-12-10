import Phaser from "phaser"

export default class AlignGrid {
    scene!: Phaser.Scene;
    graphics!: Phaser.GameObjects.Graphics;
    h!: number | undefined;
    w!: number | undefined;
    rows!: number | undefined;
    cols!: number | undefined;
    cw!: number;
    ch!: number;

    constructor(config: {scene: Phaser.Scene, rows?: number, cols?: number, width?: number, height?: number}) {
        if (!config.scene) {
            console.error("missing scene");
            return;
        }
        this.scene = config.scene;

        if (!config.rows) {
            config.rows = 3;
        }
        if (!config.cols) {
            config.cols = 3;
        }
        if (!config.width) {
            config.width = this.scene.game.config.width as number;
        }
        if (!config.height) {
            config.height = this.scene.game.config.height as number;
        }

        this.h = config.height;
        this.w = config.width;
        this.rows = config.rows;
        this.cols = config.cols;        

        //cw cell width is the scene width divided by the number of columns
        this.cw = this.w / this.cols;
        //ch cell height is the scene height divided the number of rows
        this.ch = this.h / this.rows;

    }

    // create a visual representation of the grid
    show(a = 1) {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(4, 0xff0000, a);
        this.graphics.beginPath();
        if (this.w == undefined|| this.h == undefined) {
            return
        }
        for (var i = 0; i < this.w; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.h);
        }
        for (var i = 0; i < this.h; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.w, i);
        }
        this.graphics.strokePath();
    }

    // place an object in relation to the grid
    placeAt(xx: number, yy: number, obj: Phaser.GameObjects.Image | Phaser.GameObjects.Text | undefined, adjx: number = 0, adjy: number = 0) {
        // calculate the center of the cell
        // by adding half of the height and width
        // to the x and y of the coordinates
        let x2 = this.cw * xx + this.cw / 2;
        let y2 = this.ch * yy + this.ch / 2;
        x2 += adjx;
        y2 += adjy;
        obj?.setPosition(x2, y2);
    }

}