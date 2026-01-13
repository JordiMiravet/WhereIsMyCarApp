import { Component } from '@angular/core';
import { VehicleFormModalComponent } from '../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal';
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';

@Component({
  selector: 'app-home',
  imports: [ VehicleFormModalComponent ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

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

  isModalOpen : boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedVehicle: any | null = null;

  createVehicle(): void {
    this.modalMode = 'create';
    this.selectedVehicle = null;
    this.isModalOpen = true;
  }

  editVehicle(vehicle : VehicleInterface): void {
    this.modalMode = 'edit';
    this.selectedVehicle = vehicle;
    this.isModalOpen = true;
  }

  deleteVehicle(vehicle: VehicleInterface): void {
    this.vehicles = this.vehicles.filter(v => v !== vehicle);
  }

  closeModal(): void {
    this.isModalOpen = false;
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
}
