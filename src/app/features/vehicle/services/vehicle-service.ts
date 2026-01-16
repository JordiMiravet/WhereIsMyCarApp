import { Injectable, signal, computed } from '@angular/core';
import { VehicleInterface } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})

export class VehicleService {
  
  /* To Do : Este array mas adelante debo cambiarlo a ddbb */

  private vehicles = signal<VehicleInterface[]>([
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
      name: 'Harley-Davidson',
      model: 'Electra Glide',
      plate: '5113LKG'
    },

  ]);

  vehiclesList = computed(() => this.vehicles());

  getVehicles(): VehicleInterface[] {
    return this.vehicles();
  }

  addVehicles(vehicle: VehicleInterface): void {
    this.vehicles.update( list => [...list, vehicle]);
  }

  updateVehicle(oldVehicle: VehicleInterface, newVehicle: VehicleInterface): void {
    this.vehicles.update(list => 
      list.map(v => (v === oldVehicle ? { ...newVehicle } : v))
    );
  }

  deleteVehicle(vehicle : VehicleInterface): void {
    this.vehicles.update(list => list.filter(v => v !== vehicle));
  }
  
}
