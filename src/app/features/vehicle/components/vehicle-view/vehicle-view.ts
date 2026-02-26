import { Component, inject, signal } from '@angular/core';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';
import { VehicleService } from '../../services/vehicle-service/vehicle-service';
import { VehicleModalStateService } from '../../services/vehicle-modal-state-service/vehicle-modal-state-service';
import { VehicleInterface } from '../../interfaces/vehicle';
import { CreateButtonComponent } from "../../../../shared/components/buttons/create-button/create-button";
import { VehicleTableComponent } from "../vehicle-table/vehicle-table";
import { VehicleEmptyStateComponent } from "../vehicle-empty-state/vehicle-empty-state";
import { VehicleFormModalComponent } from "../../modals/vehicle-form-modal/vehicle-form-modal";
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal";

@Component({
  selector: 'app-vehicle-view',
  imports: [CreateButtonComponent, VehicleTableComponent, VehicleEmptyStateComponent, VehicleFormModalComponent, ConfirmModalComponent],
  templateUrl: './vehicle-view.html',
  styleUrl: './vehicle-view.css',
})
export class VehicleViewComponent {
  
  private geo = inject(GeolocationService);
  
  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehicles;
  public vehicleModal = inject(VehicleModalStateService);

  ngOnInit(): void {
    this.vehicleService.loadVehicles();
  }

  /* Edit/Create Modal */

  async saveVehicle(vehicleData: VehicleInterface): Promise<void> {
    let location = vehicleData.location;

    if(!location) {
      try {
        const [lat, lng] = await this.geo.getCurrentLocation();
        location = { lat, lng };
      } catch {
        location = { 
          lat: 41.402, 
          lng: 2.194 
        }
      }
    }

    const vehicle: VehicleInterface = { ...vehicleData, location }

    if (this.vehicleModal.mode() === 'create') {
      this.vehicleService.addVehicles(vehicle)
    } else if (
      this.vehicleModal.mode() === 'edit' && 
      this.vehicleModal.selectedVehicle()
    ) {
      this.vehicleService.updateVehicle(this.vehicleModal.selectedVehicle()!, vehicle);
    }

    this.vehicleModal.close();
  }

  /* Delete Modal */

  isConfirmDeleteOpen = signal(false);
  vehicleToDelete = signal<VehicleInterface | null>(null);

  deleteConfirmation = {
    title: 'Delete vehicle?',
    message: 'Are you sure you want to delete this vehicle? This action cannot be undone.'
  }

  openConfirmDelete(vehicle: VehicleInterface) {
    this.vehicleToDelete.set(vehicle);
    this.isConfirmDeleteOpen.set(true);
  }

  confirmDeleteVehicle() {
    if (this.vehicleToDelete()) {
      this.vehicleService.deleteVehicle(this.vehicleToDelete()!)
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmDeleteOpen.set(false);
    this.vehicleToDelete.set(null);
  }
}
