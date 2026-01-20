import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from '../../../vehicle/services/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { UserLocationButtonComponent } from '../buttons/user-location-button/user-location-button';
import { C } from '@angular/cdk/keycodes';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";


@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    UserLocationButtonComponent,
    ConfirmModalComponent
],
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

  /*  Location de mi IP */

  private userMarker: L.Marker<any> | undefined;
  
  getUserLocation(coords: [ number, number ]) {
    if (this.userMarker) {
    this.userMarker.setLatLng(coords);
    } else {
      this.userMarker = L.marker(coords, {
        draggable: true,
        icon: this.locationIcon
      }).addTo(this.map).bindPopup('You').openPopup();

      this.userMarker.on('dragend', () => {
        const position = this.userMarker!.getLatLng();
        this.map.setView(position, 19);
        console.log(`Marcador: ${position.lat}, ${position.lng}`);
      });
    }

    this.map.setView(coords, 19);
  }

  // Vehicles

  // Detecte que cuando he seleccionado un coche que mire la latitud y longitud 
  // pero que cuando haya un cambio se actualice la ddbb del la lista de coches, 
  // y despues salga un modal que diga, ¿estás seguro de cambiar tu coche de posicion? 
  // y si le das a aceptar que haga ese cambio
  // Vehicles

  public locationIcon = L.icon({
    iconUrl: '/assets/icons/marker-icon.png',
    iconSize: [25, 40],
    iconRetinaUrl: '/assets/icons/marker-icon-2x.png',
    shadowUrl: '/assets/icons/marker-shadow.png',
    shadowAnchor: [9, 19],
  });

  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehicles();
  public selectedVehicle: VehicleInterface = this.vehicleList[0];

  private vehicleMarker: L.Marker | undefined;
  public showConfirmModal: boolean = false;

  private newPosition!: L.LatLng;

  showVehicle(selectedVehicle: VehicleInterface | undefined) {
    if (!selectedVehicle?.location) return;

    if (this.vehicleMarker) this.map.removeLayer(this.vehicleMarker);

    const coords: L.LatLngExpression = [
      selectedVehicle.location.lat, 
      selectedVehicle.location.lng
    ];

    this.vehicleMarker = L.marker(coords, {
      draggable: true,
      icon: this.locationIcon,
    }).addTo(this.map).bindPopup(this.selectedVehicle.name).openPopup();;

    this.vehicleMarker.on('dragend', () => {
      this.newPosition = this.vehicleMarker!.getLatLng();

      console.log('Anterioor posicioooon', this.selectedVehicle.location);
      console.log('Siguienteeee posiciooon', this.newPosition);

      this.showConfirmModal = true;
    });

    this.map.setView(coords, 19);
    this.selectedVehicle = selectedVehicle;
  }

  onConfirmLocationChange(): void {
    if (!this.newPosition || !this.selectedVehicle) return;

    this.vehicleService.updateVehicleLocation( 
      this.selectedVehicle,
      {
        lat: this.newPosition.lat,
        lng: this.newPosition.lng,
      }
    );

    this.selectedVehicle = {
      ...this.selectedVehicle,
      location: this.newPosition,
    }

    this.showConfirmModal = false;
    console.log('A ver si ha cambiado de una vez !!!', this.selectedVehicle.location);
  }

  onCancelLocationChange(): void {
    if (this.vehicleMarker && this.selectedVehicle?.location) {
      this.vehicleMarker.setLatLng([
        this.selectedVehicle.location.lat,
        this.selectedVehicle.location.lng
      ])
    }
    
    this.showConfirmModal = false;
  }

}
