import { Component, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../features/auth/services/auth';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})

export class NavigationComponent {

  private auth = inject(AuthService);
  public isLogged : Signal<boolean> = this.auth.isLogged;

}
