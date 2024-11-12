import { Game } from 'phaser';

import Load from './scenes/load';
import Play from './scenes/play';

const config: Phaser.Types.Core.GameConfig = {
    width: 420,
    height: 749,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    autoRound: false,
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: { y: 3, x: 0 },
            setBounds: {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        } // matter world config: https://docs.phaser.io/api-documentation/typedef/types-physics-matter
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

/*

Tutor looks at these docs regularly
https://docs.phaser.io/api-documentation/api-documentation

Text Styler Phaser 3
https://ourcade.co/tools/phaser3-text-styler/

*/