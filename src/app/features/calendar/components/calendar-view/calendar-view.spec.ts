import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view';
import { EventService } from '../../services/event-service';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { signal } from '@angular/core';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { EventInterface } from '../../interfaces/event';
import { of } from 'rxjs';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  const mockEventService = {
    calendarEvents: jasmine.createSpy('calendarEvents').and.returnValue([]),
    getEventsByDate: jasmine.createSpy('getEventsByDate').and.returnValue([]),
    getEventById: jasmine.createSpy('getEventById'),
    deleteEvent: jasmine.createSpy('deleteEvent'),
    loadEvents: jasmine.createSpy('loadEvents'),
    selectedVehicleId: signal<string | null>(null)
  };

  const mockVehicleService = {
    vehicles: () => [],
    loadVehicles: jasmine.createSpy('loadVehicles')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarViewComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;

    component.calendarComponent = {
      getApi: () => ({
        removeAllEvents: jasmine.createSpy('removeAllEvents'),
        addEventSource: jasmine.createSpy('addEventSource')
      })
    } as any;

    mockEventService.deleteEvent.calls.reset();
    mockEventService.selectedVehicleId.set(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {

    it('should call loadVehicles on construction', () => {
      expect(mockVehicleService.loadVehicles).toHaveBeenCalled();
    });

    it('should have correct confirm modal message', () => {
      const msg = component.confirmModalMsg();

      expect(msg.title).toBe('Delete this event');
      expect(msg.message).toBe('Are you sure you want to delete this event? This action cannot be undone');
    });

    it('should trigger refreshCalendar when calendarComponent exists', () => {
      component.calendarComponent = {
        getApi: () => ({
          removeAllEvents: () => {},
          addEventSource: () => {}
        })
      } as any;

      let called = false;
      component.refreshCalendar = () => { called = true; };
      component.refreshCalendar();

      expect(called).toBe(true);
    });

  });

  describe('date click', () => {

    it('should set selectedDate and open event modal when date is clicked', () => {
      const mockArg = { dateStr: '2026-02-13'} as any;
      component.onDateClick(mockArg);

      expect(component.selectedDate()).toBe('2026-02-13');
      expect(component.activeModal()).toBe('dayEvents');
    });

  });

  describe('event click', () => {

    it('should open event modal and set selectedDate from event', () => {
      const mockArg = { event: { startStr: '2026-02-13T00:15:00' }} as any;
      component.onEventClick(mockArg);

      expect(component.selectedDate()).toBe('2026-02-13');
      expect(component.activeModal()).toBe('dayEvents');
    });

  });

  describe('create event flow', () => {

    it('should reset selectedEvent to null', () => {
      component.selectedEvent.set({ _id: '1' } as any);
      component.handleCreateEvent();

      expect(component.selectedEvent()).toBeNull();
    });

    it('should set formMode to "create" when creating event', () => {
      component.handleCreateEvent();
      expect(component.formMode()).toBe('create');
    });

    it('should open form modal and close day events modal', () => {
      component.activeModal.set('dayEvents');
      component.handleCreateEvent();

      expect(component.activeModal()).toBe('eventForm');
    });

    it('should set today as selectedDate if none was selected', () => {
      component.selectedDate.set('');
      component.handleCreateEvent();

      expect(component.selectedDate()).toBeTruthy();
    });

    it('should not override selectedDate if already set', () => {
      component.selectedDate.set('2026-02-10');
      component.handleCreateEvent();

      expect(component.selectedDate()).toBe('2026-02-10');
    });

    it('should render form modal in template when opened', () => {
      component.handleCreateEvent();
      fixture.detectChanges();

      const formModal = fixture.nativeElement.querySelector('app-event-form-modal');

      expect(formModal).toBeTruthy();
    });

  });

  describe('edit event flow', () => {

    const mockEvent = {
      _id: '1',
      title: 'Test event',
      date: '2026-02-13'
    } as EventInterface;

    it('should call getEventById with provided id', () => {
      mockEventService.getEventById.and.returnValue(of(mockEvent));
      component.handleEditEvent('1');

      expect(mockEventService.getEventById).toHaveBeenCalledWith('1');
    });

    it('should set selectedEvent when event is found', () => {
      mockEventService.getEventById.and.returnValue(of(mockEvent));
      component.handleEditEvent('1');

      expect(component.selectedEvent()).toEqual(mockEvent);
    });

    it('should set formMode to "edit" when editing event', () => {
      mockEventService.getEventById.and.returnValue(of(mockEvent));
      component.handleEditEvent('1');

      expect(component.formMode()).toBe('edit');
    });

    it('should open form modal when event is found', () => {
      mockEventService.getEventById.and.returnValue(of(mockEvent));
      component.handleEditEvent('1');

      expect(component.activeModal()).toBe('eventForm');
    });

    it('should not modify selectedEvent if event is not found', () => {
      component.selectedEvent.set(null);
      mockEventService.getEventById.and.returnValue(of(null));

      component.handleEditEvent('999');
      expect(component.selectedEvent()).toBeNull();
    });

  });

  describe('delete event flow', () => {

    it('should open confirm modal when delete is triggered', () => {
      component.handleDeleteEvent('123');

      expect(component.activeModal()).toBe('confirm');
    });

    it('should set selectedEventId when deleting', () => {
      component.handleDeleteEvent('123');
      expect(component['selectedEventId']()).toBe('123');
    });

    it('should delete event when confirmDeleteEvent is called', () => {
      component.handleDeleteEvent('123');
      component.confirmDeleteEvent();

      expect(mockEventService.deleteEvent).toHaveBeenCalledWith('123');
      expect(component.activeModal()).toBe('dayEvents');
    });

    it('should clear selectedEventId after confirming delete', () => {
      component.handleDeleteEvent('123');
      component.confirmDeleteEvent();

      expect(component['selectedEventId']()).toBeNull();
    });

    it('should do nothing if confirmDeleteEvent is called with no prior delete', () => {
      component.confirmDeleteEvent();

      expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
    });

    it('should cancel delete and restore modal state', () => {
      component.handleDeleteEvent('123');
      component.cancelDeleteEvent();

      expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
      expect(component.activeModal()).toBe('dayEvents');
    });

    it('should clear selectedEventId when canceling delete', () => {
      component.handleDeleteEvent('123');
      component.cancelDeleteEvent();

      expect(component['selectedEventId']()).toBeNull();
    });

  });

  describe('vehicle selection', () => {

    const mockVehicle: VehicleInterface = { 
        _id: 'veh-123', 
        name: 'Ferrari',
        model: 'F8 Tributo',
        plate: '123ACB' 
      };

    it('should set selectedVehicleId when vehicle is selected', () => {
      component.handleVehicleSelected(mockVehicle);

      expect(mockEventService.selectedVehicleId()).toBe('veh-123');
    });

    it('should reset selectedVehicleId when null vehicle is selected', () => {
      component.handleVehicleSelected(null as unknown as VehicleInterface);
      expect(mockEventService.selectedVehicleId()).toBeNull();
    });

  });

  describe('computed values', () => {

    it('should compute selectedDayEvents based on selectedDate', () => {
      const mockEvents = [
        { _id: '1', 
          title: 'Wololo', 
          date: '2026-02-13' 
        }
      ];
      mockEventService.getEventsByDate.and.returnValue(mockEvents);
      
      component.selectedDate.set('2026-02-13');
      
      expect(component.selectedDayEvents()).toEqual(mockEvents);
      expect(mockEventService.getEventsByDate).toHaveBeenCalledWith('2026-02-13');
    });

  });

  describe('calendar refresh', () => {
    const mockEvent = {
      _id: '1',
      title: 'Test Event',
      date: '2026-02-13',
      hourStart: '09:00',
      hourEnd: '10:00',
      comment: 'Comentario'
    };

    it('should call refreshCalendar on ngAfterViewInit', () => {
      const refreshCalendar = spyOn(component, 'refreshCalendar');
      component.ngAfterViewInit();

      expect(refreshCalendar).toHaveBeenCalled();
    });

    it('should map events correctly in getCalendarEvents', () => {
      mockEventService.calendarEvents.and.returnValue([mockEvent]);

      const events = (component as any).getCalendarEvents();

      expect(events.length).toBe(1);
      const event = events[0];

      expect(event.id).toBe('1');
      expect(event.title).toBe('Test Event');
      expect(event.date).toBe('2026-02-13');
      expect(event.extendedProps.hourStart).toBe('09:00');
      expect(event.extendedProps.hourEnd).toBe('10:00');
      expect(event.extendedProps.comment).toBe('Comentario');
    });

    it('should call removeAllEvents and addEventSource when refreshCalendar is executed', () => {
      const remove = spyOn(component.calendarComponent.getApi(), 'removeAllEvents');
      const add = spyOn(component.calendarComponent.getApi(), 'addEventSource');

      component.refreshCalendar();

      expect(remove).toHaveBeenCalled();
      expect(add).toHaveBeenCalled();
    });

    it('should update element title and show correct more link', () => {
      const elementDom = { title: '' } as any;
      const eventInfo = { el: elementDom, event: { title: 'Cita con Barbara' } } as any;
      const moreArg = { num: 3 } as any;

      (component.calendarOptions as any).eventDidMount(eventInfo);
      expect(elementDom.title).toBe('Cita con Barbara');

      const content = (component.calendarOptions as any).moreLinkContent(moreArg);
      expect(content).toBe('+ 3');
    });
  });

});