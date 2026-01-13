import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';

import { HomeComponent } from './pages/home/home';
import { MapComponent } from './pages/map/map';
import { CalendarComponent } from './pages/calendar/calendar';
import { GraphicsComponent } from './pages/graphics/graphics';

export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: HomeComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/register']))
    },
    {
        path: 'map',
        component: MapComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/register']))
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/register']))
    },
    {
        path: 'graphics',
        component: GraphicsComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/register']))
    },
    {
        path: '**',
        redirectTo: ''
    }
];
