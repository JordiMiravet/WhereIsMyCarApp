import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map').then(m => m.MapComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar').then(m => m.CalendarComponent)
      },
      {
        path: 'graphics',
        loadComponent: () =>
          import('./pages/graphics/graphics').then(m => m.GraphicsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
