import { Injectable, signal, computed } from '@angular/core';
import { VehicleInterface } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})

export class VehicleService {
  
  /* To Do : Este array mas adelante debo cambiarlo a ddbb */

  public vehicles = signal<VehicleInterface[]>([
    {
      name: 'Mercedes GLC Coupe',
      model: 'GLC Coupe',
      plate: '3447VHZ',
      location: {
        lat: 41.486518762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Mercedes AMG S-65',
      model: 'AMG S-65 Final Edition',
      plate: '4973ZYL',
      location: {
        lat: 41.486413762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Mercedes AMG GT Black Series',
      model: 'AMG GT Black Series',
      plate: '8845JKL',
      location: {
        lat: 41.486418722458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Porsche 911',
      model: '911 Turbo S',
      plate: '9921PQR',
      location: {
        lat: 41.481418762158214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Nissan R34',
      model: 'Skyline GTR R34',
      plate: '3344XYZ',
      location: {
        lat: 41.476418762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Ducati Panigale',
      model: 'Panigale R 1299 Final Edition',
      plate: '6124DFG',
      location: {
        lat: 41.486418762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Harley-Davidson Electra-Glide',
      model: 'Electra Glide 1700',
      plate: '5113LKG',
      location: {
        lat: 41.486418762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Harley-Davidson Fat-Boy',
      model: 'Fat Boy',
      plate: '5566ABC',
      location: {
        lat: 41.486418762458214 ,  
        lng: 2.3112702960051306,
      },
    },
    {
      name: 'Triumph Bonneville',
      model: 'Bonneville Bobber 1200',
      plate: '7832HJK',
      location: {
        lat: 41.486418762458214 ,  
        lng: 2.3112702960051306,
      },
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

  updateVehicleLocation(
    vehicle: VehicleInterface,
    location: { lat: number; lng: number }
  ) {
    this.vehicles.update(list =>
      list.map(v =>
        v === vehicle
          ? { ...v, location }
          : v
      )
    );
  }

  deleteVehicle(vehicle : VehicleInterface): void {
    this.vehicles.update(list => list.filter(v => v !== vehicle));
  }

}
