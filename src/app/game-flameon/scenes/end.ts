import Phaser from 'phaser';

export default class End extends Phaser.Scene {
    playerText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'end' });
    }

    create() {
        const {width, height} = this.scale;

        // add bg image
        this.add.image(width / 2, 0, 'all-bg-high').setOrigin(0.5, 0);

        // add content
        const completeMessage = this.registry.get('completeMessage');
        const completeMessageText = this.add.text(width / 2, 500, completeMessage, { fontFamily: 'PortuguesaCaps', fontSize: '120px', color: '#323843' })
            .setOrigin(0.5, 0.5)
            .setScale(2)
            .setAlpha(0);
        const circle = this.add.image(width / 2, 1100, 'misc-circle-bg')
            .setOrigin(0.5, 0.5);
        this.add.image(width / 2, 1730, 'misc-circle-shadow').setOrigin(0.5, 0.5);    
        this.add.image(width / 2, 900, 'cursive-waiting')
            .setOrigin(0.5, 0.5);
        this.playerText = this.add.text(width / 2, 1050, '', { fontFamily: 'PortuguesaCaps', fontSize: '80px', color: '#323843', align: 'center' })
            .setOrigin(0.5, 0)

        // add animation
        this.add.tween({
            targets: completeMessageText,
            alpha: 1,
            scale: 1,
            duration: 200
        });
        this.tweens.add({
            targets: circle,
            rotation: 100,
            duration: 300000, 
            repeat: -1
        });

        // update player data
        this.updatePlayerText(this.registry.get('players'));

    }

    private updatePlayerText(playerData: { players: { name: string }[] }): void {
        let nameList = '';
        playerData.players.forEach( player => {
            nameList = nameList + player.name + '\n';
        });
        console.log(nameList);
        this.playerText.setText(`${nameList}`);
    }

}