import { Injectable, signal } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})

export class VehicleModalStateService {
  
  isOpen = signal(false);
  mode = signal<'create' | 'edit'>('create');
  selectedVehicle = signal<VehicleInterface | null>(null);

  openCreate(): void {
    this.mode.set('create');
    this.selectedVehicle.set(null);
    this.isOpen.set(true);
  }

  openEdit(vehicle: VehicleInterface): void {
    this.mode.set('edit');
    this.selectedVehicle.set(vehicle);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.selectedVehicle.set(null);
  }
  
}
