import { Routes } from '@angular/router';
import { GameRunnerComponent } from './game-runner/game-runner.component';

export const routes: Routes = [
    {
        path: 'runner',
        component: GameRunnerComponent
    },
    {
        path: '',
        redirectTo: '/runner',
        pathMatch: 'full'
    }
];
