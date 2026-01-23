import { Component, output } from '@angular/core';

@Component({
  selector: 'app-user-location-button',
  imports: [],
  templateUrl: './user-location-button.html',
  styleUrl: './user-location-button.css',
})
export class UserLocationButtonComponent {

  public click = output<void>();

}
