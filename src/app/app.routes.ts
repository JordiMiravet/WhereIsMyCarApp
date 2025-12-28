import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MapComponent } from './features/map/map';
import { CalendarComponent } from './features/calendar/calendar';
import { GraphicsComponent } from './features/graphics/graphics';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'map',
        component: MapComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'graphics',
        component: GraphicsComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
