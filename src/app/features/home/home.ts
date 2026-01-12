import { Component } from '@angular/core';
import { VehicleFormModalComponent } from "../../shared/components/modals/vehicle-form-modal/vehicle-form-modal";


@Component({
  selector: 'app-home',
  imports: [VehicleFormModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  vehicles : any[] = [
    {
      name: 'Coche Grande',
      model: 'Mercedes',
      plate: '12345-HVM',
    }
  ]

  isModalOpen : boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedVehicle: any | null = null;

  createVehicle(): void {
    this.modalMode = 'create';
    this.selectedVehicle = null;
    this.isModalOpen = true;
  }

  editVehicle(vehicle : any): void {
    this.modalMode = 'edit';
    this.selectedVehicle = vehicle;
    this.isModalOpen = true;
  }

  deleteVehicle(vehicle: any): void {
    this.vehicles = this.vehicles.filter(v => v !== vehicle);
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveVehicle(vehicleData: any): void {
    if (this.modalMode = 'create') {
      this.vehicles.push({
        ...vehicleData, 
        plate: 'AUTO-' + Math.floor(Math.random() * 1000)
      });
    } else if ( this.modalMode === 'edit' && this.selectedVehicle) {
      Object.assign(this.selectedVehicle, vehicleData)
    }

    this.closeModal();
  }
}
