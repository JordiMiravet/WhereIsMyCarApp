import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EditButtonComponent } from "../../shared/components/buttons/edit-button/edit-button";
import { DeleteButtonComponent } from "../../shared/components/buttons/delete-button/delete-button";

interface CalendarEvent {
  title: string;
  date: string;
  hourStart?: string;
  hourEnd?: string;
  comment?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule, 
    CommonModule, 
    EditButtonComponent, 
    DeleteButtonComponent
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  encapsulation: ViewEncapsulation.None,
})

export class CalendarComponent {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  // Esto lo dejo así ahora pero luego tengo que pasarlo a eventos dinamicos 

  calendarEvents: CalendarEvent[] = [
    {
      title: 'Peluquero',
      date: '2026-02-11',
      hourStart: '09:00',
      hourEnd: '15:00',
      comment: 'Ipsum dolor sit amet consectetur adipisicing elit. Quod aspernatur quas quidem, doloremque esse in porro dolorem inventore corporis ducimus! Hic nulla voluptatum tempore provident deserunt recusandae. Reprehenderit, molestias commodi.'
    },
    {
      title: 'Barbero',
      date: '2026-02-11',
      hourStart: '16:00',
      hourEnd: '17:00',
      comment: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      title: 'Cita',
      date: '2026-02-11',
      hourStart: '18:00',
      hourEnd: '19:00',
      comment: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'
    },
    {
      title: 'Revisión',
      date: '2026-02-12',
      hourStart: '10:00',
      hourEnd: '11:00',
      comment: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.'
    },
    {
      title: 'Mantenimiento',
      date: '2026-02-11',
      hourStart: '12:00',
      hourEnd: '13:30',
      comment: 'Excepteur sint occaecat cupidatat non proident.'
    }
  ];

  selectedDayEvents = signal<CalendarEvent[]>([]);
  selectedDate = signal<string>('');
  
  
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

    eventDidMount: (info : any ) => { 
      info.el.title = info.event.title
    },

    events: this.calendarEvents.map( event => ({
      title: event.title,
      date: event.date,
      extendedProps: {
        hourStart: event.hourStart,
        hourEnd: event.hourEnd,
        comment: event.comment,
      }
    })) as EventInput[],
    dayMaxEvents: 2,
    dayMaxEventRows: false,
    moreLinkContent: (arg: any) => { return `+ ${arg.num}`},
    
    eventDisplay: 'block',
    editable: false,
    timeZone: 'local',
  };

  handleDateClick(arg: DateClickArg) {
    const eventsOfDay = this.calendarEvents.filter(
      event => event.date === arg.dateStr
    );

    this.selectedDayEvents.set(eventsOfDay);
    this.selectedDate.set(arg.dateStr);
  }


}
