import { Component, inject } from '@angular/core';
import { VehicleService } from '../../services/vehicle-service/vehicle-service';
import { VehicleModalState } from '../../enum/vehicle-modal-state.enum';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';
import { VehicleInterface } from '../../interfaces/vehicle';
import { CreateButtonComponent } from "../../../../shared/components/buttons/create-button/create-button";
import { VehicleTableComponent } from "../vehicle-table/vehicle-table";
import { VehicleEmptyStateComponent } from "../vehicle-empty-state/vehicle-empty-state";
import { VehicleFormModalComponent } from "../../modals/vehicle-form-modal/vehicle-form-modal";
import { VehicleModalService} from '../../services/vehicle-modal-service/vehicle-modal-service';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";

@Component({
  selector: 'app-vehicle-view',
  standalone: true,
  imports: [
    CreateButtonComponent,
    VehicleTableComponent,
    VehicleEmptyStateComponent,
    VehicleFormModalComponent,
    ConfirmModalComponent
  ],
  templateUrl: './vehicle-view.html',
  styleUrl: './vehicle-view.css',
})
export class VehicleViewComponent {
  
  private geo = inject(GeolocationService);
  private vehicleService = inject(VehicleService);
  
  public vehicleList = this.vehicleService.vehicles;
  public modalState = inject(VehicleModalService);
  
  public VehicleModalState = VehicleModalState;

  public messages = {
    deleteConfirmation : {
      title: 'Delete vehicle?',
      message: 'Are you sure you want to delete this vehicle? This action cannot be undone.'
    }
  }

  ngOnInit(): void {
    this.vehicleService.loadVehicles();
  }

  async saveVehicle(vehicleData: VehicleInterface): Promise<void> {
    
    if (this.modalState.formMode() === 'create') {
      let location = vehicleData.location;

      if (!location) {
        try {
          const [lat, lng] = await this.geo.getCurrentLocation();
          location = { lat, lng };
        } catch {
          location = { lat: 41.402, lng: 2.194 };
        }
      }

      const vehicle: VehicleInterface = { ...vehicleData, location };
      this.vehicleService.addVehicles(vehicle);

    } else if (this.modalState.formMode() === 'edit') {
      const originalVehicle = this.modalState.selectedVehicle();
      if (!originalVehicle) return;

      const vehicle: VehicleInterface = {
        ...vehicleData,
        location: originalVehicle.location
      };

      this.vehicleService.updateVehicle(originalVehicle, vehicle);
    }

    this.modalState.close();
  }

  confirmDeleteVehicle(): void {
    const vehicle = this.modalState.selectedVehicle();
    
    if (vehicle) {
      this.vehicleService.deleteVehicle(vehicle);
    }
    
    this.modalState.close();
  }

}
