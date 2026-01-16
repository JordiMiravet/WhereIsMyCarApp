import { Component, computed, inject, Signal, signal } from '@angular/core';
import { VehicleFormModalComponent } from '../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal';
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { ConfirmModal } from "../../shared/components/confirm-modal/confirm-modal";
import { CreateButtonComponent } from "../../shared/components/buttons/create-button/create-button";
import { DeleteButtonComponent } from "../../shared/components/buttons/delete-button/delete-button";
import { EditButtonComponent } from "../../shared/components/buttons/edit-button/edit-button";
import { VehicleService } from '../../features/vehicle/services/vehicle-service';

@Component({
  selector: 'app-home',
  imports: [
    VehicleFormModalComponent, 
    ConfirmModal, 
    CreateButtonComponent, 
    DeleteButtonComponent, 
    EditButtonComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehiclesList;

  /* Edit/Create Modal */

  isVehicleModalOpen = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  selectedVehicle = signal<any | null>(null);

  createVehicle(): void {
    this.modalMode.set('create');
    this.selectedVehicle.set(null);
    this.isVehicleModalOpen.set(true);
  }

  editVehicle(vehicle : VehicleInterface): void {
    this.modalMode.set('edit');
    this.selectedVehicle.set(vehicle);
    this.isVehicleModalOpen.set(true);
  }

  closeModal(): void {
    this.isVehicleModalOpen.set(false);
  }

  saveVehicle(vehicleData: VehicleInterface): void {
    if (this.modalMode() === 'create') {
      this.vehicleService.addVehicles(vehicleData)
    } else if (this.modalMode() === 'edit' && this.selectedVehicle) {
      this.vehicleService.updateVehicle(this.selectedVehicle()!, vehicleData);
    }

    this.closeModal();
  }

  /* Delete Modal */

  isConfirmDeleteOpen = signal(false);
  vehicleToDelete = signal<VehicleInterface | null>(null);

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
