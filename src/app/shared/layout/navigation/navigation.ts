import { Component, inject, Signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../features/auth/auth';


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
