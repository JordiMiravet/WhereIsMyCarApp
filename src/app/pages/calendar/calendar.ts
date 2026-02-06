import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ FullCalendarModule, CommonModule ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // Esto lo dejo así ahora pero luego tengo que pasarlo a eventos dinamicos 
  calendarEvents: EventInput[] = [
    { title: 'Cita', date: '2026-02-11' },
    { title: 'Revisión', date: '2026-02-12' },
    { title: 'Mantenimiento', date: '2026-02-11' }
  ];

  selectedDayEvents = signal<EventInput[]>([]);
  selectedDate = signal<string>('');
  
  calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    weekends: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    dateClick: (arg : DateClickArg) => this.handleDateClick(arg),
    events: this.calendarEvents,
    height: 'auto',
    contentHeight: 'auto'
  };

  handleDateClick(arg : DateClickArg) {
    console.log('A ver si va de una veeeeez ! ! ! dia clicado', arg.dateStr);

    const eventsOfDay = this.calendarEvents.filter(event => event.date === arg.dateStr);
    this.selectedDayEvents.set(eventsOfDay);
    this.selectedDate.set(arg.dateStr);
  }

}
