import { Injectable, signal, computed } from '@angular/core';
import { EventInterface } from '../interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  
  private _allEvents = signal<EventInterface[]>([
    /* Mercedes GLC Coupe */
    {
      _id: '1',
      title: 'Trabajo rutina',
      date: '2026-02-16',
      hourStart: '08:00',
      hourEnd: '15:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '2',
      title: 'Trabajo rutina',
      date: '2026-02-17',
      hourStart: '08:00',
      hourEnd: '15:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '3',
      title: 'Trabajo rutina',
      date: '2026-02-18',
      hourStart: '08:00',
      hourEnd: '15:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '4',
      title: 'Trabajo rutina',
      date: '2026-02-19',
      hourStart: '08:00',
      hourEnd: '15:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '5',
      title: 'Trabajo rutina',
      date: '2026-02-20',
      hourStart: '08:00',
      hourEnd: '15:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    /* Mercedes AMG S-65 */
    {
      _id: '6',
      title: 'Cita médica',
      date: '2026-02-20',
      hourStart: '16:45',
      hourEnd: '17:45',
      comment: '',
      vehicleId: '6981e55a08fca1004920359c',
    },
    /* Mercedes AMG GT Black Serie */
    {
      _id: '7',
      title: 'Cena de negocios',
      date: '2026-02-17',
      hourStart: '19:30',
      hourEnd: '22:00',
      comment: '',
      vehicleId: '6981e56b08fca1004920359e',
    },
    {
      _id: '8',
      title: 'Cita',
      date: '2026-02-19',
      hourStart: '08:30',
      hourEnd: '11:30',
      comment: '',
      vehicleId: '6981e56b08fca1004920359e',
    },
    /* Ducati Panigale */
    {
      _id: '9',
      title: 'Ruta sábado',
      date: '2026-02-21',
      hourStart: '09:00',
      hourEnd: '16:00',
      comment: '',
      vehicleId: '6981e5a608fca100492035a8',
    },
    /* Porsche */
    {
      _id: '10',
      title: 'Salida noche',
      date: '2026-02-21',
      hourStart: '18:30',
      hourEnd: '23:00',
      comment: '',
      vehicleId: '6981e57f08fca100492035a0',
    },
    /* Nissan 34 */
    {
      _id: '11',
      title: 'Ruta domingo',
      date: '2026-02-22',
      hourStart: '09:30',
      hourEnd: '18:30',
      comment: '',
      vehicleId: '6981e59208fca100492035a6',
    },
  ]);

  public selectedVehicleId = signal<string | null>(null);

  public calendarEvents = computed(() => {
    const vehicleId = this.selectedVehicleId();
    
    if (!vehicleId) {
      return this._allEvents();
    } else {
      return this._allEvents().filter(event => event.vehicleId === vehicleId);
    }
  });
  
  getEventById(id: string): EventInterface | null {
    const event = this.calendarEvents().find(event => event._id === id);
    return event 
      ? event 
      : null;
  }

  getEventsByDate(date: string): EventInterface[] { 
    return this.calendarEvents().filter(events => events.date === date);
  }

  addEvent(event: EventInterface): void {
    const newEvent: EventInterface = {
      ...event,
      _id: this.generateId(),
    };
    this._allEvents.update(events => [...events, newEvent]);
  }

  updateEvent(updatedEvent: EventInterface): void {
    this._allEvents.update(events => 
      events.map(event => 
        event._id === updatedEvent._id 
          ? updatedEvent 
          : event
      )
    );
  }

  deleteEvent(id: string): void {
    this._allEvents.update(events => 
      events.filter(e => e._id !== id)
    );
  }

  private generateId(): string {
    // TODO: Cuando pase todo al backend, esta funcion ya no será necesaria
    return crypto.randomUUID();
  }

}