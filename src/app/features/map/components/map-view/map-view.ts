import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { UserLocationButtonComponent } from '../buttons/user-location-button/user-location-button';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";
import { VehicleSelectorComponent } from "../../../../shared/components/vehicle-selector/vehicle-selector";
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    UserLocationButtonComponent,
    ConfirmModalComponent,
    VehicleSelectorComponent, 
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
  }

  private initMap(): void {
    this.map = L.map('map').setView([41.478, 2.310], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  // VEHICLES LOCATION

  private vehicleService = inject(VehicleService);
  public vehicles = this.vehicleService.vehicles;
  
  public selectedVehicle = signal<VehicleInterface | null>(null);

  private vehicleMarker?: L.Marker;
  public newPosition = signal<L.LatLng | null>(null);

  public showConfirmModal = signal(false);

  showVehicle(vehicle: VehicleInterface): void {
    if (this.vehicleMarker) this.map.removeLayer(this.vehicleMarker);

    this.selectedVehicle.set(vehicle);

    const coords: L.LatLngExpression = [
      vehicle.location!.lat,
      vehicle.location!.lng
    ];

    this.vehicleMarker = L.marker(coords, {
      draggable: true,
      icon: this.locationIcon,
    }).addTo(this.map).bindPopup(vehicle.name).openPopup();

    this.vehicleMarker.on('dragend', () => {
      this.newPosition.set(this.vehicleMarker!.getLatLng());

      console.log('Anterior posiciooon', vehicle.location);
      console.log('Siguiente posiciooon', this.newPosition());

      this.showConfirmModal.set(true);
    });

    this.map.setView(coords, 19);
  }

  onConfirmLocationChange(): void {
    const vehicle = this.selectedVehicle();
    const position = this.newPosition();

  if (!position || !vehicle) return;

  const updateVehicle: VehicleInterface = {
    ...vehicle,
    location: position
  };

  this.vehicleService.updateVehicleLocation(
    updateVehicle,
    {
      lat: position.lat,
      lng: position.lng,
    }
  );

  this.selectedVehicle.set(updateVehicle);
  this.showConfirmModal.set(false);

  console.log('Cambios efectuados ? dime que si',this.selectedVehicle()?.location);
  }

  onCancelLocationChange(): void {

    const vehicle = this.selectedVehicle();

    if (this.vehicleMarker && vehicle?.location) {
      this.vehicleMarker.setLatLng([
        vehicle.location.lat,
        vehicle.location.lng
      ]);
    }

    this.showConfirmModal.set(false);
  }

























  // USER LOCATION

  private geo = inject(GeolocationService);
  private userMarker?: L.Marker;
  
  async onUserLocationClick(): Promise<void> {
    try {
      const coords = await this.geo.getCurrentLocation();
      this.getUserLocation(coords);
    } catch {
      alert('Could not obtain geolocation');
    }
  }

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
