import { Routes } from '@angular/router';
import { GameRunnerComponent } from './game-runner/game-runner.component';
import { GameXPComponent } from './game-xp/game-xp.component';
import { GameMSComponent } from './game-matterstack/game-ms.component';
import { GameBOComponent } from './game-msbreakout/game-bo.component';
import { GameFOComponent } from './game-flameon/game-fo.component';


export const routes: Routes = [
    {
        path: 'runner',
        component: GameRunnerComponent
    },
    {
        path: 'xp',
        component: GameXPComponent
    },
    {
        path: 'ms',
        component: GameMSComponent
    },
    {
        path: 'bo',
        component: GameBOComponent
    },
    {
        path: 'fo',
        component: GameFOComponent
    },
    {
        path: '',
        redirectTo: '/fo',
        pathMatch: 'full'
    }
];
