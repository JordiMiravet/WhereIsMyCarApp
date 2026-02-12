import { Injectable, signal, computed } from '@angular/core';
import { EventInterface } from '../interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  
  private _allEvents = signal<EventInterface[]>([
    {
      _id: '1',
      title: 'Ir al trabajo',
      date: '2026-02-10',
      hourStart: '07:00',
      hourEnd: '16:00',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '2',
      title: 'Cita médica',
      date: '2026-02-10',
      hourStart: '16:45',
      hourEnd: '17:45',
      comment: '',
      vehicleId: '6981e52008fca1004920359a',
    },
    {
      _id: '3',
      title: 'Cena con amigos',
      date: '2026-02-10',
      hourStart: '20:30',
      hourEnd: '23:00',
      comment: '',
      vehicleId: '6981e55a08fca1004920359c',
    },

    {
      _id: '4',
      title: 'Reunión trabajo',
      date: '2026-02-11',
      hourStart: '09:00',
      hourEnd: '12:00',
      comment: '',
      vehicleId: '6981e55a08fca1004920359c',
    },
    {
      _id: '5',
      title: 'Gimnasio',
      date: '2026-02-11',
      hourStart: '18:00',
      hourEnd: '20:30',
      comment: '',
      vehicleId: '6981e56b08fca1004920359e',
    },

    {
      _id: '6',
      title: 'Barbero',
      date: '2026-02-13',
      hourStart: '09:00',
      hourEnd: '10:00',
      comment: '',
      vehicleId: '6981e57f08fca100492035a0',
    },

    {
      _id: '7',
      title: 'Concentración JDM',
      date: '2026-02-16',
      hourStart: '17:00',
      hourEnd: '23:30',
      comment: '',
      vehicleId: '6981e59208fca100492035a6',
    },
    {
      _id: '8',
      title: 'Ruta domingo',
      date: '2026-02-16',
      hourStart: '08:00',
      hourEnd: '16:00',
      comment: '',
      vehicleId: '6981e5b808fca100492035ab',
    },
    {
      _id: '9',
      title: 'Comida familiar',
      date: '2026-02-16',
      hourStart: '14:30',
      hourEnd: '17:00',
      comment: '',
      vehicleId: '6981e5ca08fca100492035ad',
    },
    {
      _id: '10',
      title: 'Lavado rápido',
      date: '2026-02-16',
      hourStart: '18:00',
      hourEnd: '18:45',
      comment: '',
      vehicleId: '6981e56b08fca1004920359e',
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