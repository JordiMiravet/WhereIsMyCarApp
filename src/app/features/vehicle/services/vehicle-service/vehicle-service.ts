import { Injectable, signal, computed, inject } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class VehicleService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/vehicles';

  public vehicles = signal<VehicleInterface[]>([]);

  loadVehicles(): void {
    this.http.get<VehicleInterface[]>(this.apiUrl)
      .subscribe({
        next: vehicles => this.vehicles.set(vehicles),
        error: err => console.error('Load vehicles error', err)
      })
  }

  addVehicles(vehicle: VehicleInterface): void {
    this.http.post<VehicleInterface>(this.apiUrl, vehicle)
      .subscribe( vehicleCreated => {
        this.vehicles.update(list => [ ...list, vehicleCreated ]);
      })
  }

  updateVehicle(oldVehicle: VehicleInterface, newVehicle: VehicleInterface): void {
    this.http.put<VehicleInterface>(
      `${this.apiUrl}/${oldVehicle.plate}`,
      newVehicle
    ).subscribe( updatedVehicle => {
      this.vehicles.update( list => 
        list.map( v => v.plate === oldVehicle.plate 
          ? updatedVehicle
          : v
        )
      )
    })
  }

  updateVehicleLocation(
    vehicle: VehicleInterface,
    location: { lat: number; lng: number }
  ): void {

    const updatedLocation = { location }

    this.http.put<VehicleInterface>(
      `${this.apiUrl}/${vehicle.plate}`,
      updatedLocation
    ).subscribe(updatedVehicle => {
      this.vehicles.update(list =>
        list.map(v =>
          v.plate === vehicle.plate ? updatedVehicle : v
        )
      );
    });
  }

  deleteVehicle(vehicle: VehicleInterface): void {
    this.http.delete<void>(`${this.apiUrl}/${vehicle.plate}`)
      .subscribe(() => {
        this.vehicles.update(list =>
          list.filter(v => v.plate !== vehicle.plate)
        );
      });
  }

  /* Mantendré esto por ahora, (IMPORTANTE!!!): en un par de commits lo borro */

  /*
  public vehicles = signal<VehicleInterface[]>([
    
    {
      name: 'Mercedes GLC Coupe',
      model: 'GLC Coupe',
      plate: '3447VHZ',
      location: {
        lat: 41.486394600830806,  
        lng: 2.3118222053234576,
      },
    },
    {
      name: 'Mercedes AMG S-65',
      model: 'AMG S-65 Final Edition',
      plate: '4973ZYL',
      location: {
        lat: 41.48640269148522, 
        lng: 2.311292239335883
      },
    },
    {
      name: 'Mercedes AMG GT Black Series',
      model: 'AMG GT Black Series',
      plate: '8845JKL',
      location: {
        lat: 41.48646299087552, 
        lng: 2.3110505434182826,
      },
    },
    {
      name: 'Porsche 911',
      model: '911 Turbo S',
      plate: '9921PQR',
      location: {
        lat: 41.48644688584013, 
        lng: 2.3107555554463137,
      },
    },
    {
      name: 'Nissan R34',
      model: 'Skyline GTR R34',
      plate: '3344XYZ',
      location: {
        lat: 41.48653535720899, 
        lng: 2.31162985104779
      },
    },
    {
      name: 'Ducati Panigale',
      model: 'Panigale R 1299 Final Edition',
      plate: '6124DFG',
      location: {
        lat: 41.48670822425964, 
        lng: 2.3106223748280597
      },
    },
    {
      name: 'Harley-Davidson Electra-Glide',
      model: 'Electra Glide 1700',
      plate: '5113LKG',
      location: {
        lat: 41.48731124524427, 
        lng: 2.310466966262244
      },
    },
    {
      name: 'Harley-Davidson Fat-Boy',
      model: 'Fat Boy',
      plate: '5566ABC',
      location: {
        lat: 41.48730721538785, 
        lng: 2.3104556817274973
      },
    },
    {
      name: 'Triumph Bonneville',
      model: 'Bonneville Bobber 1200',
      plate: '7832HJK',
      location: {
        lat: 41.48739163788307, 
        lng: 2.31035386232231
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

  updateVehicle(
    oldVehicle: VehicleInterface, 
    newVehicle: VehicleInterface
  ): void {
    this.vehicles.update(list => 
      list.map(v => (v.plate === oldVehicle.plate ? { ...newVehicle } : v))
    );
  }

  updateVehicleLocation(
    vehicle: VehicleInterface,
    location: { lat: number; lng: number }
  ) {
    this.vehicles.update(list =>
      list.map(v =>
        v.plate === vehicle.plate
          ? { ...v, location }
          : v
      )
    );
  }

  deleteVehicle(vehicle : VehicleInterface): void {
    this.vehicles.update(list => list.filter(v => v !== vehicle));
  }
  */
}
