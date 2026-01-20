import { Component, output } from '@angular/core';

@Component({
  selector: 'app-user-location-button',
  imports: [],
  templateUrl: './user-location-button.html',
  styleUrl: './user-location-button.css',
})
export class UserLocationButtonComponent {

    public locationFound = output<[number, number]>();
    
    getLocation() {
      if(!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition( (position) => {
        this.locationFound.emit([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      }, () => {
        alert('No se pudo obtener la geolocalización');
      }
    );
  }
}
