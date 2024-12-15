import { Game } from 'phaser';

import LoadInit from './scenes/load-init';
import LoadSub from './scenes/load-sub';
import Splash from './scenes/splash';
import Hud from './scenes/hud';
import Build1Next from './scenes/build1-next';
import Build2Recipe from './scenes/build2-recipe';
import Build3Play from './scenes/build3-play';
import End from './scenes/end';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    scale: {
        mode: Phaser.Scale.EXPAND,
        //autoCenter: Phaser.Scale.CENTER_BOTH,

    },
    autoRound: false,
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: { y: 6, x: 0 },
            setBounds: {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        }
    },
    backgroundColor: '#FFF',
    scene: [
        LoadInit,
        LoadSub,
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