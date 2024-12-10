import { Game } from 'phaser';

import Load from './scenes/load';
import Splash from './scenes/splash';
import Hud from './scenes/hud';
import Build1Next from './scenes/build1-next';
import Build2Recipe from './scenes/build2-recipe';
import Build3Play from './scenes/build3-play';
import End from './scenes/end';

const config: Phaser.Types.Core.GameConfig = {
    width: 1080,
    height: 1920,
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
    backgroundColor: '#FFF',
    scene: [
        Load,
        Splash,
        Build1Next,
        Build2Recipe,
        Build3Play,
        End,
        Hud
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