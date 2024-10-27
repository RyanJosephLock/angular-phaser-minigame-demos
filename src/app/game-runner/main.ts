import { AUTO, Game } from 'phaser';
import Play from './scenes/play';

const config: Phaser.Types.Core.GameConfig = {
    width: 600,
    height: 300,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    autoRound: false,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 350, x: 0 },
            debug: true,
        },
    },
    backgroundColor: '#001f3f',
    scene: [
        Play
    ]
}

export const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}