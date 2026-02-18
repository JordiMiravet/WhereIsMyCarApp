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
  
  public getHoursByWeekdayPerVehicle() {
    const events = this.eventService['_allEvents']();
    const vehicles = this.vehicleService.vehicles();

    const weekdayNames = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    
    const result = vehicles.map(vehicle => ({
      id: vehicle._id,
      name: vehicle.name,
      hours: [0,0,0,0,0,0,0]
    }));

    events.forEach(event => {
      const { vehicleId, date, hourStart, hourEnd } = event;
      if(!vehicleId || !date || !hourStart || !hourEnd) return;

      const numberDay = new Date(date).getDay();
      const dayIndex = numberDay === 0 
        ? 6 
        : numberDay - 1;
      
      const hours = this.calculateEventHours(hourStart, hourEnd);
      const vehicleData = result.find(v => v.id === vehicleId);

      if(vehicleData) {
        vehicleData.hours[dayIndex] += hours;
      }
    });

    return { weekdayNames, vehicles: result };
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

}
