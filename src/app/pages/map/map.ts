import { Component, inject } from '@angular/core';
import { MapViewComponent } from "../../features/map/components/map-view/map-view";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../features/vehicle/components/vehicle-empty-state/vehicle-empty-state";
import { VehicleModalService } from '../../features/vehicle/services/vehicle-modal-service/vehicle-modal-service';
import { VehicleFormModalComponent } from "../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal";
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { GeolocationService } from '../../shared/services/geolocation/geolocation-service';
import { VehicleModalState } from '../../features/vehicle/enum/vehicle-modal-state.enum';

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
  public vehicleModal = inject(VehicleModalService);
  
  public VehicleModalState = VehicleModalState;

  ngOnInit(): void {
    this.vehicleService.loadVehicles();
  }
  
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

    if (this.vehicleModal.formMode() === 'create') {
      this.vehicleService.addVehicles(vehicle);
    } else if (
      this.vehicleModal.formMode() === 'edit' && 
      this.vehicleModal.selectedVehicle()
    ) {
      this.vehicleService.updateVehicle(this.vehicleModal.selectedVehicle()!, vehicle);
    }
    
    this.vehicleModal.close();
  }
}