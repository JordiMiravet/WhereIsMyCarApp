
import { Component, Inject, inject, signal } from '@angular/core';
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { VehicleFormModalComponent } from '../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal';
import { ConfirmModalComponent } from "../../shared/components/modals/confirm-modal/confirm-modal";
import { CreateButtonComponent } from "../../shared/components/buttons/create-button/create-button";
import { DeleteButtonComponent } from "../../shared/components/buttons/delete-button/delete-button";
import { EditButtonComponent } from "../../shared/components/buttons/edit-button/edit-button";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../shared/components/vehicle-empty-state/vehicle-empty-state";
import { VehicleModalStateService } from '../../features/vehicle/services/vehicle-modal-state-service/vehicle-modal-state-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    VehicleFormModalComponent,
    ConfirmModalComponent,
    CreateButtonComponent,
    DeleteButtonComponent,
    EditButtonComponent,
    VehicleEmptyStateComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent {

  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehiclesList;
  public vehicleModal = inject(VehicleModalStateService);

  /* Edit/Create Modal */

  saveVehicle(vehicleData: VehicleInterface): void {
    if (this.vehicleModal.mode() === 'create') {
      this.vehicleService.addVehicles(vehicleData)
    } else if (this.vehicleModal.mode() === 'edit' && this.vehicleModal.selectedVehicle()) {
      this.vehicleService.updateVehicle(this.vehicleModal.selectedVehicle()!, vehicleData);
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
