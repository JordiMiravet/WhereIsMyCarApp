import {
  Component,
  signal,
  computed,
  ViewChild,
  ViewEncapsulation,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { EventInterface } from '../../interfaces/calendar-event';
import { DayEventsModalComponent } from '../../modals/day-events-modal/day-events-modal';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal';
import { EventService } from '../../services/event-service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, DayEventsModalComponent, ConfirmModalComponent],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarViewComponent implements AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private eventService = inject(EventService);

  selectedDate = signal<string>('');
  selectedEventId = signal<string | null>(null);

  isEventModalOpen = signal(false);
  isConfirmModalOpen = signal(false);

  selectedDayEvents = computed(() => this.eventService.getEventsByDate(this.selectedDate()));

  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],

    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today',
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
    eventClick: (info: EventClickArg) => this.handleEventClick(info),

    events: [],

    dayMaxEvents: 2,
    dayMaxEventRows: false,
    moreLinkContent: (arg: any) => `+ ${arg.num}`,
    eventDidMount: (info: any) => (info.el.title = info.event.title),

    eventDisplay: 'list-item',
    editable: false,
    timeZone: 'local',
  };

  private getCalendarEvents(): EventInput[] {
    return this.eventService.calendarEvents().map((event) => ({
      title: event.title,
      date: event.date,
      extendedProps: {
        hourStart: event.hourStart,
        hourEnd: event.hourEnd,
        comment: event.comment,
      },
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

  handleEventClick(info: EventClickArg): void {
    // TODO: Mas adelante ya cambiaré el evento para que cuando clique se abra solo ese evento especifico
    this.selectedDate.set(info.event.startStr.split('T')[0]);
    this.isEventModalOpen.set(true);
  }

  requestDeleteEvent(id: string): void {
    this.selectedEventId.set(id);
    this.isEventModalOpen.set(false);
    this.isConfirmModalOpen.set(true);
  }

  confirmDeleteEvent(): void {
    const id = this.selectedEventId();
    if (id === null) return;

    this.eventService.deleteEvent(id);
    this.refreshCalendar();

    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventId.set(null);
  }

  cancelDeleteEvent(): void {
    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventId.set(null);
  }

  ngAfterViewInit(): void {
    this.refreshCalendar();
  }
}