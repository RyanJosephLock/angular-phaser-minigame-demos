import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('game-over');
    }

    create(data: {title: string})
    {
        const { width, height } = this.scale
        this.add.text( width * 0.5, height * 0.5, data.title, {
            fontSize: '48px',
			color: '#fff',
			backgroundColor: '#FF0000DE',
			padding: { left: 20, right: 20, top: 20, bottom: 20 }
        })
        .setOrigin(0.5, 0.5);
    }

}