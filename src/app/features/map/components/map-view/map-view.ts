import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from '../../../vehicle/services/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { UserLocationButtonComponent } from '../buttons/user-location-button/user-location-button';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";
import { VehicleSelectorComponent } from "../../../../shared/components/vehicle-selector/vehicle-selector";

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    UserLocationButtonComponent,
    ConfirmModalComponent,
    VehicleSelectorComponent
  ],
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.css'],
})
export class MapViewComponent implements OnInit {

  private map!: L.Map;

  public locationIcon = L.icon({
    iconUrl: '/assets/icons/marker-icon.png',
    iconSize: [25, 40],
    iconRetinaUrl: '/assets/icons/marker-icon-2x.png',
    shadowUrl: '/assets/icons/marker-shadow.png',
    shadowAnchor: [9, 19],
  });

  ngOnInit(): void {
    this.initMap();
    this.vehicleList.set(this.vehicleService.getVehicles());
  }

  private initMap(): void {
    this.map = L.map('map').setView([41.478, 2.310], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  // VEHICLES LOCATION

  private vehicleService = inject(VehicleService);
  public vehicleList = signal<VehicleInterface[]>(this.vehicleService.getVehicles());
  
  public selectedVehicle?: VehicleInterface;

  private vehicleMarker?: L.Marker;
  private newPosition?: L.LatLng;

  public showConfirmModal = false;

  
  showVehicle(vehicle: VehicleInterface): void {
    this.selectedVehicle = vehicle;

    if (this.vehicleMarker) this.map.removeLayer(this.vehicleMarker);

    const coords: L.LatLngExpression = [
      vehicle.location!.lat,
      vehicle.location!.lng
    ];

    this.vehicleMarker = L.marker(coords, {
      draggable: true,
      icon: this.locationIcon,
    }).addTo(this.map).bindPopup(vehicle.name).openPopup();

    this.vehicleMarker.on('dragend', () => {
      this.newPosition = this.vehicleMarker!.getLatLng();

      // console.log('Anterioor posicioooon', vehicle.location);
      // console.log('Siguienteeee posiciooon', this.newPosition);

      this.showConfirmModal = true;
    });

    this.map.setView(coords, 19);
  }

  onConfirmLocationChange(): void {
    if (!this.newPosition || !this.selectedVehicle) return;

    // tengo que arreglar toda esta parte para no tener que hacer doble spread operator 
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
    // console.log('A ver si ha cambiado de una vez !!!', this.selectedVehicle.location)

    this.showConfirmModal = false;
  }

  onCancelLocationChange(): void {
    if (this.vehicleMarker && this.selectedVehicle) {
      this.vehicleMarker.setLatLng([
        this.selectedVehicle.location!.lat,
        this.selectedVehicle.location!.lng
      ]);
    }

    this.showConfirmModal = false;
  }

  // USER LOCATION

  private userMarker?: L.Marker;

  getUserLocation(coords: [number, number]): void {
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

}
