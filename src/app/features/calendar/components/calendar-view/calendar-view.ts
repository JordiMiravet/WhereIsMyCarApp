
import { Component, signal, computed, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { CalendarEventInterface } from '../../interfaces/calendar-event';
import { DayEventsModalComponent } from "../../modals/day-events-modal/day-events-modal";
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    DayEventsModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarViewComponent {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents = signal<CalendarEventInterface[]>([
    {
      title: 'Peluquero',
      date: '2026-02-11',
      hourStart: '09:00',
      hourEnd: '15:00',
      comment: 'Ipsum dolor sit amet consectetur adipisicing elit...'
    },
    {
      title: 'Barbero',
      date: '2026-02-11',
      hourStart: '16:00',
      hourEnd: '17:00',
      comment: 'Ipsum dolor sit amet consectetur adipisicing elit...'
    },
    {
      title: 'Cita',
      date: '2026-02-11',
      hourStart: '18:00',
      hourEnd: '23:00',
      comment: 'Ipsum dolor sit amet consectetur adipisicing elit...'
    },
    {
      title: 'Revisión',
      date: '2026-02-14',
      hourStart: '10:00',
      hourEnd: '11:00',
      comment: 'Ipsum dolor sit amet consectetur adipisicing elit...'
    },
  ]);
  selectedDayEvents = computed(() => 
    this.calendarEvents().filter(e => e.date === this.selectedDate())
  );

  selectedDate = signal<string>('');
  selectedEventIndex = signal<number | null>(null);

  isEventModalOpen = signal(false);
  isConfirmModalOpen = signal(false);

  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],

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

    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),

    eventDidMount: (info: any) => {
      info.el.title = info.event.title;
    },

    events: [],

    dayMaxEvents: 2,
    dayMaxEventRows: false,
    moreLinkContent: (arg: any) => `+ ${arg.num}`,

    eventDisplay: 'block',
    editable: false,
    timeZone: 'local',
  };

  private getCalendarEvents(): EventInput[] {
    return this.calendarEvents().map(event => ({
      title: event.title,
      date: event.date,
      extendedProps: {
        hourStart: event.hourStart,
        hourEnd: event.hourEnd,
        comment: event.comment,
      }
    }));
  }

  private refreshCalendar(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(this.getCalendarEvents());
  }

  handleDateClick(arg: DateClickArg): void {
    this.selectedDate.set(arg.dateStr);
    this.isEventModalOpen.set(true);
  }

  requestDeleteEvent(index: number): void {
    this.selectedEventIndex.set(index);
    this.isEventModalOpen.set(false);
    this.isConfirmModalOpen.set(true);
  }

  confirmDeleteEvent(): void {
    const index = this.selectedEventIndex();
    if (index === null) return;

    const eventToDelete = this.selectedDayEvents()[index];

    this.calendarEvents.update(events =>
      events.filter(e =>
        !(e.date === eventToDelete.date &&
          e.title === eventToDelete.title &&
          e.hourStart === eventToDelete.hourStart)
      )
    );

    this.refreshCalendar();

    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventIndex.set(null);
  }

  cancelDeleteEvent(): void {
    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventIndex.set(null);
  }

  ngAfterViewInit(): void {
    this.refreshCalendar();
  }
}