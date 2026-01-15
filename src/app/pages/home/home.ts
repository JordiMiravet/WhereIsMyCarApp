import { Component } from '@angular/core';
import { VehicleFormModalComponent } from '../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal';
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { ConfirmModal } from "../../shared/components/confirm-modal/confirm-modal";
import { CreateButton } from "../../shared/components/buttons/create-button/create-button";

@Component({
  selector: 'app-home',
  imports: [VehicleFormModalComponent, ConfirmModal, CreateButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  /* To Do : Este array mas adelante debo cambiarlo a un servicio y luego manejarlo con backend, pero por ahora va bien de fake */

  vehicles : VehicleInterface[] = [
    {
      name: 'Coche Grande',
      model: 'Range Rover',
      plate: '3447VHZ'
    },
    {
      name: 'Coche Pequeño',
      model: 'Mini',
      plate: '4973ZYL'
    },
    {
      name: 'Harley',
      model: 'Electra Glide',
      plate: '5113LKG'
    },
  ]

  /* Edit/Create Modal */

  isVehicleModalOpen : boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedVehicle: any | null = null;

  createVehicle(): void {
    this.modalMode = 'create';
    this.selectedVehicle = null;
    this.isVehicleModalOpen = true;
  }

  editVehicle(vehicle : VehicleInterface): void {
    this.modalMode = 'edit';
    this.selectedVehicle = vehicle;
    this.isVehicleModalOpen = true;
  }

  closeModal(): void {
    this.isVehicleModalOpen = false;
  }

  saveVehicle(vehicleData: VehicleInterface): void {
    if (this.modalMode === 'create') {
      const newVehicle = { ...vehicleData };
      this.vehicles = [...this.vehicles, newVehicle];
    } else if (this.modalMode === 'edit' && this.selectedVehicle) {
      this.vehicles = this.vehicles.map(v =>
        v === this.selectedVehicle ? { ...v, ...vehicleData } : v
      );
    }

    this.closeModal();
  }

  /* Delete Modal */

  isConfirmDeleteOpen = false;
  vehicleToDelete: VehicleInterface | null = null;

  openConfirmDelete(vehicle: VehicleInterface) {
    this.vehicleToDelete = vehicle;
    this.isConfirmDeleteOpen = true;
  }

  confirmDeleteVehicle() {
    if (this.vehicleToDelete) {
      this.vehicles = this.vehicles.filter(v => v !== this.vehicleToDelete);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmDeleteOpen = false;
    this.vehicleToDelete = null;
  }
}
