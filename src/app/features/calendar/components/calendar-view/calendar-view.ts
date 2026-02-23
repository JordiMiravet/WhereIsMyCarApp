import { Component, signal, computed, ViewChild, ViewEncapsulation, inject, AfterViewInit, effect } from '@angular/core';
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
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { EventInterface } from '../../interfaces/event';
import { CreateButtonComponent } from "../../../../shared/components/buttons/create-button/create-button";

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    DayEventsModalComponent,
    ConfirmModalComponent,
    EventFormModalComponent,
    VehicleSelectorComponent,
    CreateButtonComponent
  ],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
  encapsulation: ViewEncapsulation.None,
})

export class CalendarViewComponent implements AfterViewInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private eventService = inject(EventService);
  public vehicleService = inject(VehicleService);

  public selectedDate = signal<string>('');
  private selectedEventId = signal<string | null>(null);

  // TODO: Pasar el formMode a enums
  public formMode = signal<'create' | 'edit'>('create');
  public selectedEvent = signal<EventInterface | null>(null);

  // TODO: Pasar el activeModal a enums
  public activeModal = signal<'dayEvents' | 'eventForm' | 'confirm' | null>(null);

  public confirmModalMsg = signal({
    title: 'Delete this event',
    message: 'Are you sure you want to delete this event? This action cannot be undone'
  })

  selectedDayEvents = computed(() => this.eventService.getEventsByDate(this.selectedDate()));


  calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],

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

    dateClick: (arg: DateClickArg) => this.onDateClick(arg),
    eventClick: (info: EventClickArg) => this.onEventClick(info),

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
    this.vehicleService.loadVehicles();

    effect(() => {
      const events = this.eventService.calendarEvents();
      if (this.calendarComponent) {
        this.refreshCalendar();
      }
    });
  }

  ngAfterViewInit(): void {
    this.eventService.loadEvents();
    this.refreshCalendar(); 
  }

  // Eventos click 

  onDateClick(arg: DateClickArg): void {
    this.selectedDate.set(arg.dateStr);
    this.activeModal.set('dayEvents');
  }

  onEventClick(info: EventClickArg): void {
    this.selectedDate.set(info.event.startStr.split('T')[0]);
    this.activeModal.set('dayEvents');
  }

  // Logica del Create

  handleCreateEvent() {
    // TODO: Tengo que añadirle la logica del modal de isconfirmModal 
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate.set(this.selectedDate() || today);

    this.formMode.set('create');
    this.selectedEvent.set(null);

    this.activeModal.set('eventForm');
  }
  
  // Logica del Edit

  handleEditEvent(id: string): void { 
    this.eventService.getEventById(id).subscribe(event => {
      this.formMode.set('edit');
      this.selectedEvent.set(event);
      this.activeModal.set('eventForm');
    });
  }

  // Logica del Delete 

  handleDeleteEvent(id: string): void {
    this.selectedEventId.set(id);
    this.activeModal.set('confirm');
  }

  confirmDeleteEvent(): void {
    const id = this.selectedEventId();
    if (id === null) return;

    this.eventService.deleteEvent(id);

    this.selectedEventId.set(null);
    this.activeModal.set('dayEvents');
  }

  cancelDeleteEvent(): void {
    this.selectedEventId.set(null);
    this.activeModal.set('dayEvents');
  }

  // Refresh de los eventos

  public refreshCalendar(): void {
    const calendarApi = this.calendarComponent.getApi();
    
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(this.getCalendarEvents());
  }

  // Eventos

  private getCalendarEvents(): EventInput[] {
    return this.eventService.calendarEvents().map((event) => ({
      id: event._id,
      title: event.title,
      date: event.date,
      extendedProps: {
        hourStart: event.hourStart,
        hourEnd: event.hourEnd,
        comment: event.comment,
      },
    }));
  }

  // Vehiculo

  handleVehicleSelected(vehicle: VehicleInterface): void {
    if (!vehicle) {
      this.eventService.selectedVehicleId.set(null);
    } else {
      this.eventService.selectedVehicleId.set(vehicle._id!);
    }
  }
  
}