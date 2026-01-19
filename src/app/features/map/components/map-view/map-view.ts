import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from '../../../vehicle/services/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';


@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.css'],
})

export class MapViewComponent implements OnInit {
  
  private map: any;
  

  ngOnInit(): void {
      this.initMap();
  }

  private initMap() {
    this.map = L.map('map').setView([41.478, 2.310], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  // Vehicles

  public myIcon = L.icon({
    iconUrl: 'assets/icons/marker-icon.png',
    iconSize: [50, 50],
    iconRetinaUrl: 'assets/icons/marker-icon-2x.png',
    shadowUrl: 'assets/icons/marker-shadow.png'
  });

  private vehicleService = inject(VehicleService)
  public vehicleList = this.vehicleService.vehicles;
  public selectedVehicle : VehicleInterface = this.vehicleList()[0];

  private vehicleMarker: L.Marker | undefined;

  showVehicle(selectedVehicle: VehicleInterface | undefined) {
      
    if(!selectedVehicle?.location) return;
    
    const coords : L.LatLngExpression  = [ selectedVehicle.location.lat, selectedVehicle.location.lng ];

    if(this.vehicleMarker) {
        this.map.removeLayer(this.vehicleMarker);
    } 

    this.vehicleMarker = L.marker(coords, {
      draggable: true,

    }).addTo(this.map)//.bindPopup(selectedVehicle.name).openPopup();

    this.vehicleMarker.on('dragend', () => {
      const position = this.vehicleMarker!.getLatLng();

      this.vehicleService.updateVehicleLocation(
        selectedVehicle,
        { lat: position.lat, lng: position.lng }
      )

      console.log('A ver si va esto de una vez:', position.lat, position.lng)
    });

    this.map.setView(coords, 19);
    this.selectedVehicle = selectedVehicle;
  }

  /*  Location de mi IP */

  private userMarker: L.Marker<any> | undefined;
  
  getLocation() {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const coords : [ number, number ] = [ position.coords.latitude, position.coords.longitude ];

        if (this.userMarker) {
          this.userMarker = L.marker(coords);
        } else {
          this.userMarker = L.marker(coords, {
            draggable:true,
            /* icon:myIcon, */
          }).addTo(this.map).bindPopup('You vehicle are here').openPopup();

          this.userMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.setLatLng(position).openPopup();
            this.map.setView(position, 19);
            console.log(`Marcador : ${position.lat}, ${position.lng}`)
          })
        }

        this.map.setView(coords, 19);

      }, () => {
        alert('No se pudo obtener la geolocalización')
      });

    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  }

}
