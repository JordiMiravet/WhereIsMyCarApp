import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

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
    { title: 'Peluquero', date: '2026-02-11' },
    { title: 'Barbero', date: '2026-02-11' },
    { title: 'Cita', date: '2026-02-11' },
    { title: 'Revisión', date: '2026-02-12' },
    { title: 'Mantenimiento', date: '2026-02-11' }
  ];

  selectedDayEvents = signal<EventInput[]>([]);
  selectedDate = signal<string>('');
  selectedEvent = signal<string>('');
  
  calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],

    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    showNonCurrentDates: true,
    fixedWeekCount: false,
    weekends: true,
    firstDay: 1,
    
    nowIndicator: true,
    selectable: true,
    
    height: 'auto',
    contentHeight: 'auto',
    
    dateClick: (arg : DateClickArg) => this.handleDateClick(arg),
    eventDidMount: (info : any ) => { info.el.title = info.event.title},
    events: this.calendarEvents,
    dayMaxEvents: 2,
    moreLinkContent: (arg: any) => { return `+ ${arg.num}`}, /* Esto no me convence como queda, pero por ahora lo dejo así */
    dayMaxEventRows: false,
    eventDisplay: 'list-item',
    editable: true,
    timeZone: 'local',
  };

  handleDateClick(arg : DateClickArg) {
    console.log('A ver si va de una veeeeez ! ! ! dia clicado?!', arg.dateStr);

    const eventsOfDay = this.calendarEvents.filter(event => event.date === arg.dateStr);
    this.selectedDayEvents.set(eventsOfDay);
    this.selectedDate.set(arg.dateStr);
  }

}
