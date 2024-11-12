import { Game } from 'phaser';

import Load from './scenes/load';
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
        default: "matter",
        matter: {
            debug: true
        }
    },
    backgroundColor: '#000',
    scene: [
        Load,
        Play
    ]
}

export const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}