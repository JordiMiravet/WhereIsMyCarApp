import { Injectable, signal, computed, inject } from '@angular/core';
import { EventInterface } from '../interfaces/event';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/events';

  private _allEvents = signal<EventInterface[]>([]);
  public selectedVehicleId = signal<string | null>(null);

  public calendarEvents = computed(() => {
    const vehicleId = this.selectedVehicleId();
    if (!vehicleId) return this._allEvents();
    return this._allEvents().filter(event => event.vehicleId === vehicleId);
  });

  loadEvents(): void {
    this.http.get<EventInterface[]>(this.apiUrl)
      .subscribe(events => this._allEvents.set(events));
  }

  getEventById(id: string): Observable<EventInterface> {
    return this.http.get<EventInterface>(`${this.apiUrl}/${id}`);
  }

  getEventsByDate(date: string): EventInterface[] {
    return this.calendarEvents().filter(
      event => event.date === date
    );
  }

  addEvent(event: Omit<EventInterface, '_id'>): void {
    this.http.post<EventInterface>(this.apiUrl, event)
      .subscribe(newEvent => {
        this._allEvents.update(events => [...events, newEvent]);
      });
  }

  updateEvent(updatedEvent: EventInterface): void {
    this.http.put<EventInterface>(`${this.apiUrl}/${updatedEvent._id}`, updatedEvent)
      .subscribe(event => {
        this._allEvents.update(events =>
          events.map(e => e._id === event._id ? event : e)
        );
      });
  }

  deleteEvent(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`)
      .subscribe(() => {
        this._allEvents.update(events =>
          events.filter(e => e._id !== id)
        );
      });
  }
}