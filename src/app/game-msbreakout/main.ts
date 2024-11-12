import { Game } from 'phaser';

import Load from './scenes/load';
import Play from './scenes/play';
import GameOver from './scenes/game-over';

const config: Phaser.Types.Core.GameConfig = {
    width: 600,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    autoRound: false,
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: { y: 0, x: 0 },
            setBounds: {
                top: true,
                right: true,
                bottom: false,
                left: true
            }
        } // matter world config: https://docs.phaser.io/api-documentation/typedef/types-physics-matter
    },
    backgroundColor: '#000',
    scene: [
        Load,
        Play,
        GameOver
    ]
}

export const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

/*

Follows this tutorial:
https://www.youtube.com/watch?v=z15L4E7A3wY&list=PLNwtXgWIx3rh23MYaPLgqLDePAQgK1kQN

Tutor looks at these docs regularly
https://docs.phaser.io/api-documentation/api-documentation

Text Styler Phaser 3
https://ourcade.co/tools/phaser3-text-styler/

*/