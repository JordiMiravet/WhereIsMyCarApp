import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MapComponent } from './features/map/map';
import { CalendarComponent } from './features/calendar/calendar';
import { GraphicsComponent } from './features/graphics/graphics';
import { RegisterComponent } from './core/auth/register/register';
import { LoginComponent } from './core/auth/login/login';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';


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
