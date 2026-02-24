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
    this.map = this.mapService.initMap('map', [41.478, 2.310], 10);
    this.vehicleService.loadVehicles();
  }

  showVehicle(vehicle: VehicleInterface): void {
    this.selectedVehicle.set(vehicle);

    const coords: [number, number] = [
      vehicle.location!.lat, 
      vehicle.location!.lng
    ];

    this.placeVehicleMarker(coords, vehicle.name);
  }

  async onUserLocationClick(): Promise<void> {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return;

    try {
      const coords = await this.geo.getCurrentLocation();
      
      this.placeVehicleMarker(coords, vehicle.name);

      const position = L.latLng(coords);
      this.vehicleService.updateVehicleLocation(vehicle, position);
      
      this.selectedVehicle.set({ 
        ...vehicle, 
        location: { lat: position.lat, lng: position.lng }
      });

    } catch (error) {
      console.error(error);
    }
  }

  private placeVehicleMarker(coords: [number, number] | L.LatLng, vehicleName: string): void {
    if (this.vehicleMarker) {
      this.mapService.removeLayer(this.vehicleMarker);
    }

    this.vehicleMarker = this.mapService.createMarker(coords, vehicleName);

    this.vehicleMarker.on('dragend', () => {
      const position = this.vehicleMarker!.getLatLng();
      this.newPosition.set(position);
      this.showConfirmModal.set(true);
    });

    this.mapService.setView(coords, 19);
  }

  onConfirmLocationChange(): void {
    const vehicle = this.selectedVehicle();
    const position = this.newPosition();

    if (!vehicle || !position) return;

    this.vehicleService.updateVehicleLocation(vehicle, position);

    this.selectedVehicle.set({ 
      ...vehicle, 
      location: { lat: position.lat, lng: position.lng }
    });
    this.mapService.setView(position, 19);
    this.showConfirmModal.set(false);
  }

  onCancelLocationChange(): void {
    const vehicle = this.selectedVehicle();

    if (this.vehicleMarker && vehicle?.location) {
      const originalCoords: [number, number] = [
        vehicle.location.lat,
        vehicle.location.lng
      ];
      
      this.vehicleMarker.setLatLng(originalCoords);
      this.mapService.setView(originalCoords, 19);
    }

    this.showConfirmModal.set(false);
  }
}