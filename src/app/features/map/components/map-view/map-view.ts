import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';

import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';
import { MapService } from '../../services/map-service';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';

import { VehicleSelectorComponent } from '../../../vehicle/components/vehicle-selector/vehicle-selector';
import { UserLocationButtonComponent } from '../buttons/user-location-button/user-location-button';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";
  
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

  private readonly mapService = inject(MapService);
  private readonly geo = inject(GeolocationService);
  private readonly vehicleService = inject(VehicleService);

  public readonly vehicles = this.vehicleService.vehicles;

  private map!: L.Map;
  private vehicleMarker?: L.Marker;
  private userMarker?: L.Marker;

  public selectedVehicle = signal<VehicleInterface | null>(null);
  public newPosition = signal<L.LatLng | null>(null);

  public showConfirmModal = signal(false);

  public messages = {
    confirm: {
      title: 'Change vehicle position',
      message: 'Are you sure about changing the position of the vehicle?'
    }
  };

  ngOnInit(): void {
    this.map = this.mapService.initMap(
      'map', 
      [41.478, 2.310], 
      10
    );
  }

  // VEHICLES LOCATION

  showVehicle(vehicle: VehicleInterface): void {
    if (this.vehicleMarker) {
      this.mapService.removeLayer(this.vehicleMarker);
      this.vehicleMarker = undefined;
    }

    this.selectedVehicle.set(vehicle);

    const coords = L.latLng(
      vehicle.location!.lat, 
      vehicle.location!.lng
    );

    this.vehicleMarker = this.mapService.createMarker(coords, vehicle.name);

    this.vehicleMarker.on('dragend', () => {
      const position = this.vehicleMarker!.getLatLng();

      this.newPosition.set(position);
      this.mapService.setView(position, 19);

      this.showConfirmModal.set(true);
    });

    this.mapService.setView(coords, 19);
  }

  // USER LOCATION

  async onUserLocationClick(): Promise<void> {
    try {
      const coords = await this.geo.getCurrentLocation();
      this.getUserLocation(coords);

      const vehicle = this.selectedVehicle();
      if (vehicle && this.vehicleMarker) {
        this.mapService.removeLayer(this.vehicleMarker);

        this.vehicleMarker = this.mapService.createMarker(coords, vehicle.name);

        this.newPosition.set(L.latLng(coords[0], coords[1]));
        this.showConfirmModal.set(true);

        this.mapService.setView(coords, 19);
      }

    } catch {
      console.error('Could not obtain geolocation');
    }
  }

  getUserLocation(coords: [number, number]): void {
    if (this.userMarker) {
      this.userMarker.setLatLng(coords);
    } else {
      this.userMarker = this.mapService.createMarker(coords, "You");

      this.userMarker.on('dragend', () => {
        const position = this.userMarker!.getLatLng();
        this.mapService.setView(position);
      });
    }

    this.mapService.setView(coords, 19);
  }

  onConfirmLocationChange(): void {
    const vehicle = this.selectedVehicle();
    const position = this.newPosition();

    if (!vehicle || !position) return;

    const updated: VehicleInterface = { 
      ...vehicle, 
      location: position 
    };

    this.vehicleService.updateVehicleLocation(updated, position);

    this.selectedVehicle.set(updated);
    this.showConfirmModal.set(false);
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

}
