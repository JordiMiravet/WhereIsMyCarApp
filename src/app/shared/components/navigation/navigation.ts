import { Component, inject, WritableSignal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../features/user/auth';

@Component({
  selector: 'header[navigation]',
  imports: [ RouterLink ],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})
export class NavigationComponent {

  private auth = inject(AuthService);
  private router =  inject(Router);

  public isLogged : WritableSignal<boolean> = this.auth.isLogged;

  onLogout(){
    this.auth.logout()
    .then( () => {
      this.router.navigate(['register'])
    })
    .catch( error => console.error(error) );
  }
}
