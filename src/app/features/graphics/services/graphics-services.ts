import { inject, Injectable } from '@angular/core';

import { VehicleMetrics } from '../interfaces/VehicleMetrics';

import { EventService } from '../../calendar/services/event-service';
import { VehicleService } from '../../vehicle/services/vehicle-service/vehicle-service';

@Injectable({
  providedIn: 'root',
})

export class GraphicsServices {

  private eventService = inject(EventService);
  private vehicleService = inject(VehicleService)

  public getVehicleUsageHours(): VehicleMetrics[] {

    const events = this.eventService['_allEvents']();
    const vehicles = this.vehicleService.vehicles();

    const result: VehicleMetrics[] = [];

    vehicles.forEach(vehicle => {
      let totalHours = 0;

      events.forEach(event => {
        const isSameVehicle = event.vehicleId === vehicle._id;
        const hasValidHours = event.hourStart && event.hourEnd;

        if (isSameVehicle && hasValidHours) {
          const hours = this.calculateEventHours(event.hourStart!, event.hourEnd!);
          totalHours += hours;
        }
      });

      if (totalHours > 0) {
        result.push({
          vehicleId: vehicle._id!,
          vehicleName: vehicle.name,
          totalHours: totalHours
        });
      }

    });

    return result;

  }

  private calculateEventHours(hourStart: string, hourEnd: string): number {
    const [ startH, startM ] = hourStart.split(':').map(Number);
    const startMinutes = (startH * 60) + startM;

    const [ endH, endM ] = hourEnd.split(':').map(Number);
    const endMinutes = (endH * 60) + endM;

    const diffMinutes = endMinutes - startMinutes;
    const hours = diffMinutes / 60;

    return hours;
  }
  
  public getMostUsedVehicle(): VehicleMetrics | null {
    const allVehicles = this.getVehicleUsageHours();
    if (!allVehicles.length) return null;

    const mostUsedVehicle = allVehicles.reduce((prevVehicle, currentVehicle) => 
      currentVehicle.totalHours > prevVehicle.totalHours 
        ? currentVehicle 
        : prevVehicle
    );

    return mostUsedVehicle;
  }

  

}
