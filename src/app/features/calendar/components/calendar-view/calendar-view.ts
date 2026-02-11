import {
  Component,
  signal,
  computed,
  ViewChild,
  ViewEncapsulation,
  inject,
  AfterViewInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { DayEventsModalComponent } from '../../modals/day-events-modal/day-events-modal';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal';
import { EventService } from '../../services/event-service';
import { EventFormModalComponent } from "../../modals/event-form-modal/event-form-modal";
import { VehicleSelectorComponent } from "../../../vehicle/components/vehicle-selector/vehicle-selector";

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    DayEventsModalComponent,
    ConfirmModalComponent,
    EventFormModalComponent,
    VehicleSelectorComponent
],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  encapsulation: ViewEncapsulation.None,
})

export class CalendarViewComponent implements AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private eventService = inject(EventService);

  public selectedDate = signal<string>('');
  private selectedEventId = signal<string | null>(null);

  public isEventModalOpen = signal(false);
  public isConfirmModalOpen = signal(false);
  public isCreateModalOpen = signal(false);

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

  constructor() {
    effect(() => {
      this.eventService.calendarEvents();
      
      if (this.calendarComponent) {
        this.refreshCalendar();
      }
    });
  }

  ngAfterViewInit(): void {
    this.refreshCalendar();
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

  handleCreateEvent() {
    // TODO: Estoy Aqui
    if (!this.selectedDate()) {
      const today = new Date().toISOString().split('T')[0];
      this.selectedDate.set(today);
    }
    this.isCreateModalOpen.set(true);
    this.isEventModalOpen.set(false);
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

    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventId.set(null);
  }

  cancelDeleteEvent(): void {
    this.isConfirmModalOpen.set(false);
    this.isEventModalOpen.set(true);
    this.selectedEventId.set(null);
  }

  public refreshCalendar(): void {
    const calendarApi = this.calendarComponent.getApi();

    calendarApi.removeAllEvents();
    calendarApi.addEventSource(this.getCalendarEvents());
  }

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

}