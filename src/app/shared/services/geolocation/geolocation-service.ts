import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  
  getCurrentLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([ position.coords.latitude, position.coords.longitude ]);
        }, () => reject('Location error'),
        // TODO: estudiar esta posibilidad que me ha dicho joseAngel sobre la geolocalizacion movil: { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } 
      );
    });
  }
  
}
