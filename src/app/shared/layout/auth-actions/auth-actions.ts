import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth';

@Component({
  selector: 'app-auth-actions',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './auth-actions.html',
  styleUrls: ['./auth-actions.css'],
})

export class AuthActionsComponent {
  
  private auth = inject(AuthService);
  private router =  inject(Router);

  public isLogged : Signal<boolean> = this.auth.isLogged;

  onLogout(){
    this.auth.logout()
    .then( () => {
      this.router.navigate(['login'])
    })
    .catch( error => console.error(error) );
  }
  
}
