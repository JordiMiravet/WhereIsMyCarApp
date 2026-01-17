import { Component, inject, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../features/auth/auth';

@Component({
  selector: 'header[navigation]',
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})
export class NavigationComponent {

  private auth = inject(AuthService);
  private router =  inject(Router);

  public isLogged : Signal<boolean> = this.auth.isLogged;

  onLogout(){
    this.auth.logout()
    .then( () => {
      this.router.navigate(['register'])
    })
    .catch( error => console.error(error) );
  }
}
