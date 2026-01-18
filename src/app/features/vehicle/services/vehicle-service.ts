import { Injectable, signal, computed } from '@angular/core';
import { VehicleInterface } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})

export class VehicleService {
  
  /* To Do : Este array mas adelante debo cambiarlo a ddbb */

  private vehicles = signal<VehicleInterface[]>([
    {
      name: 'Mercedes GLC Coupe',
      model: 'GLC Coupe',
      plate: '3447VHZ'
    },
    {
      name: 'Mercedes AMG S-65',
      model: 'AMG S-65 Final Edition',
      plate: '4973ZYL'
    },
    {
      name: 'Mercedes AMG GT Black Series',
      model: 'AMG GT Black Series',
      plate: '8845JKL'
    },
    {
      name: 'Porsche 911',
      model: '911 Turbo S',
      plate: '9921PQR'
    },
    {
      name: 'Nissan R34',
      model: 'Skyline GTR R34',
      plate: '3344XYZ'
    },
    {
      name: 'Ducati Panigale',
      model: 'Panigale R 1299 Final Edition',
      plate: '6124DFG'
    },
    {
      name: 'Harley-Davidson Electra-Glide',
      model: 'Electra Glide 1700',
      plate: '5113LKG'
    },
    {
      name: 'Harley-Davidson Fat-Boy',
      model: 'Fat Boy',
      plate: '5566ABC'
    },
    {
      name: 'Triumph Bonneville',
      model: 'Bonneville Bobber 1200',
      plate: '7832HJK'
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
