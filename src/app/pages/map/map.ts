import { Component, inject } from '@angular/core';
import { MapViewComponent } from "../../features/map/components/map-view/map-view";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../features/vehicle/components/vehicle-empty-state/vehicle-empty-state";
import { VehicleModalStateService } from '../../features/vehicle/services/vehicle-modal-state-service/vehicle-modal-state-service';
import { VehicleFormModalComponent } from "../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal";
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { GeolocationService } from '../../shared/services/geolocation/geolocation-service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MapViewComponent,
    VehicleEmptyStateComponent,
    VehicleFormModalComponent
],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})

export class MapComponent {

  private geo = inject(GeolocationService);
  
  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehicles;
  public vehicleModal = inject(VehicleModalStateService);
  
  async saveVehicle(vehicleData: VehicleInterface): Promise<void> {
    let location = vehicleData.location;

    if (!location) {
      try {
        const [lat, lng] = await this.geo.getCurrentLocation();
        location = { lat, lng };
      } catch {
        location = { lat: 41.478, lng: 2.310 };
      }
    }

    const vehicle: VehicleInterface = { ...vehicleData, location };

    if(this.vehicleModal.mode() === 'create'){
      this.vehicleService.addVehicles(vehicle);
    } else if (
      this.vehicleModal.mode() === 'edit' && 
      this.vehicleModal.selectedVehicle()
    ) {
      this.vehicleService.updateVehicle(this.vehicleModal.selectedVehicle()!, vehicle);
    }
    this.vehicleModal.close();
  }
}
