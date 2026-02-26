import { Injectable, signal } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';
import { VehicleModalState } from '../../enum/vehicle-modal-state.enum';

@Injectable({
  providedIn: 'root',
})
export class VehicleModalService {
  
  public activeModal = signal<VehicleModalState>(VehicleModalState.Closed);
  public formMode = signal<'create' | 'edit'>('create');
  public selectedVehicle = signal<VehicleInterface | null>(null);

  openCreate(): void {
    this.formMode.set('create');
    this.selectedVehicle.set(null);
    this.activeModal.set(VehicleModalState.VehicleForm);
  }

  openEdit(vehicle: VehicleInterface): void {
    this.formMode.set('edit');
    this.selectedVehicle.set(vehicle);
    this.activeModal.set(VehicleModalState.VehicleForm);
  }

  openConfirmDelete(vehicle: VehicleInterface): void {
    this.selectedVehicle.set(vehicle);
    this.activeModal.set(VehicleModalState.ConfirmDelete);
  }

  close(): void {
    this.activeModal.set(VehicleModalState.Closed);
    this.selectedVehicle.set(null);
  }

}
