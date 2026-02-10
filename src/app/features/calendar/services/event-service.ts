import { Injectable, signal } from '@angular/core';
import { EventInterface } from '../interfaces/event';

@Injectable({
  providedIn: 'root',
})

export class EventService {
  
  calendarEvents = signal<EventInterface[]>([
    {
      _id: '1',
      title: 'Peluquero',
      date: '2026-02-11',
      hourStart: '09:00',
      hourEnd: '15:00',
      comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex similique asperiores quas fuga ad quis labore, iure, soluta eum sunt enim quasi tempore consectetur sint!',
    },
    {
      _id: '2',
      title: 'Barbero',
      date: '2026-02-11',
      hourStart: '16:00',
      hourEnd: '17:00',
      comment: '',
    },
    {
      _id: '3',
      title: 'Cita',
      date: '2026-02-11',
      hourStart: '18:00',
      hourEnd: '23:00',
      comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex similique asperiores quas fuga ad quis labore, iure, soluta eum sunt enim quasi tempore consectetur sint!',
    },
    {
      _id: '4',
      title: 'Revisión',
      date: '2026-02-14',
      hourStart: '10:00',
      hourEnd: '11:00',
      comment: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex similique asperiores quas fuga ad quis labore, iure, soluta eum sunt enim quasi tempore consectetur sint!',
    },
  ]);
  
  getEventsByDate(date: string): EventInterface[]  { 
    return this.calendarEvents().filter( events => events.date === date )
  }

  addEvent(event: EventInterface) {
    const newEvent: EventInterface = {
      ...event,
      _id: this.generateId(),
    }
    this.calendarEvents.update( events => [ ...events, newEvent ]);
  }

  updateEvent(updatedEvent: EventInterface) {
    this.calendarEvents.update( events => 
      events.map( event => 
        event._id === updatedEvent._id 
          ? updatedEvent 
          : event
      )
    )
  }

  deleteEvent(id: string) {
    this.calendarEvents.update( events => 
      events.filter( e => e._id !== id)
    )
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

}
