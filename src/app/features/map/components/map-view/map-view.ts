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

  private mapService = inject(MapService);

  private map!: L.Map;

  ngOnInit(): void {
    this.map = this.mapService.initMap(
      'map', 
      [41.478, 2.310], 
      10
    );
  }

  public messages = ({
    confirm : {
      title : 'Change vehicle position',
      message : 'Are you sure about changing the position of the vehicle?'
    }
  })
  
  // VEHICLES LOCATION

  private vehicleService = inject(VehicleService);
  public vehicles = this.vehicleService.vehicles;

  public selectedVehicle = signal<VehicleInterface | null>(null);
  private vehicleMarkers: L.Marker[] = [];
  private vehicleMarker?: L.Marker;

  public newPosition = signal<L.LatLng | null>(null);

  public showConfirmModal = signal(false);

  showVehicle(vehicle: VehicleInterface): void {
    if (this.vehicleMarker) {
      this.mapService.removeLayer(this.vehicleMarker);
    }

    this.selectedVehicle.set(vehicle);

    const coords: L.LatLngExpression = [
      vehicle.location!.lat,
      vehicle.location!.lng
    ];

    this.vehicleMarker = this.mapService.createMarker(
      coords,
      vehicle.name
    );

    this.vehicleMarker.on('dragend', () => {
      this.newPosition.set(this.vehicleMarker!.getLatLng());

      console.log('Anterior posiciooon', vehicle.location);
      console.log('Siguiente posiciooon', this.newPosition());

      this.showConfirmModal.set(true);
    });

    this.mapService.setView(coords);
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
      this.userMarker = this.mapService.createMarker(coords, "You");

      this.userMarker.on('dragend', () => {
        const position = this.userMarker!.getLatLng();
        this.mapService.setView(position);

        console.log(`Marcador: ${position.lat}, ${position.lng}`);
      });
    }

    this.mapService.setView(coords, 19);
  }

}
