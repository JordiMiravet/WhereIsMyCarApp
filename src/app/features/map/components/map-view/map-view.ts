import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
  private allVehicleMarkers: L.Marker[] = [];
  private selectedVehicleMarker?: L.Marker;

  public selectedVehicle = signal<VehicleInterface | null>(null);
  public newPosition = signal<L.LatLng | null>(null);
  public showConfirmModal = signal(false);

  public messages = {
    mapView: {
      ariaLabel : 'Interactive map showing vehicle positions. Visual only, drag points to move vehicles with mouse or touch'
    },
    confirmModal: {
      title: 'Change vehicle position',
      message: 'Are you sure about changing the position of the vehicle?'
    },
  };

  constructor() {
    effect(() => {
      const vehicleList = this.vehicles();
      if (vehicleList.length > 0 && !this.selectedVehicle()) {
        this.showAllVehicles();
      }
    });
  }

  ngOnInit(): void {
    this.map = this.mapService.initMap('map', [41.478, 2.310], 10);
    this.vehicleService.loadVehicles();
  }

  private showAllVehicles(): void {
    this.clearAllMarkers();

    const vehicleList = this.vehicles();
    const bounds = L.latLngBounds([]);

    vehicleList.forEach(vehicle => {
      if (!vehicle.location) return;

      const coords: [number, number] = [vehicle.location.lat, vehicle.location.lng];
      const marker = this.mapService.createMarker(coords, vehicle.name, false);

      this.allVehicleMarkers.push(marker);
      bounds.extend(coords);
    });

    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  showVehicle(vehicle: VehicleInterface | null): void {
    this.selectedVehicle.set(vehicle);
    this.clearAllMarkers();

    if (!vehicle) {
      this.showAllVehicles();
      return;
    }

    if (!vehicle.location) return;

    const coords: [number, number] = [vehicle.location.lat, vehicle.location.lng];
    this.placeSelectedVehicleMarker(coords, vehicle.name);
  }

  async onUserLocationClick(): Promise<void> {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return;

    try {
      const coords = await this.geo.getCurrentLocation();
      this.placeSelectedVehicleMarker(coords, vehicle.name);
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

  private placeSelectedVehicleMarker(coords: [number, number] | L.LatLng, vehicleName: string): void {
    this.clearSelectedMarker();
    this.selectedVehicleMarker = this.mapService.createMarker(coords, vehicleName, true);

    this.selectedVehicleMarker.on('dragend', () => {
      const position = this.selectedVehicleMarker!.getLatLng();
      this.newPosition.set(position);

      this.showConfirmModal.set(true);
    });

    this.mapService.setView(coords, 19);
  }

  private clearAllMarkers(): void {
    this.allVehicleMarkers.forEach(
      marker => this.mapService.removeLayer(marker)
    );
    this.allVehicleMarkers = [];
  }

  private clearSelectedMarker(): void {
    if (this.selectedVehicleMarker) {
      this.mapService.removeLayer(this.selectedVehicleMarker);
      this.selectedVehicleMarker = undefined;
    }
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
    if (!vehicle?.location || !this.selectedVehicleMarker) return;

    const originalCoords: [number, number] = [
      vehicle.location.lat, 
      vehicle.location.lng
    ];

    this.selectedVehicleMarker.setLatLng(originalCoords);
    this.mapService.setView(originalCoords, 19);

    this.showConfirmModal.set(false);
  }
}