import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view';
import { EventService } from '../../services/event-service';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { signal } from '@angular/core';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;

  const mockEventService = {
    calendarEvents: jasmine.createSpy('calendarEvents').and.returnValue([]),
    getEventsByDate: jasmine.createSpy('getEventsByDate').and.returnValue([]),
    getEventById: jasmine.createSpy('getEventById'),
    deleteEvent: jasmine.createSpy('deleteEvent'),
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
    (component as any).selectedEventId?.set(null);
    component.isConfirmModalOpen.set(false);
    component.isEventModalOpen.set(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('date click', () => {

    it('should set selectedDate and open event modal when date is clicked', () => {
      const mockArg = { dateStr: '2026-02-13'} as any;
      component.handleDateClick(mockArg);

      expect(component.selectedDate()).toBe('2026-02-13');
      expect(component.isEventModalOpen()).toBeTrue();
    });

  });

  describe('event click', () => {

    it('should open event modal and set selectedDate from event', () => {
      const mockArg = { event: { startStr: '2026-02-13T00:15:00' }} as any;
      component.handleEventClick(mockArg);

      expect(component.selectedDate()).toBe('2026-02-13');
      expect(component.isEventModalOpen()).toBeTrue();
    });

  });

  describe('create event flow', () => {

    it('should reset editingEvent to null', () => {
      component.editingEvent.set({ _id: '1' } as any);
      component.handleCreateEvent();

      expect(component.editingEvent()).toBeNull();
    });

    it('should open form modal and close event modal', () => {
      component.isEventModalOpen.set(true);
      component.handleCreateEvent();

      expect(component.isEventFormModalOpen()).toBeTrue();
      expect(component.isEventModalOpen()).toBeFalse();
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
    } as any;

    it('should call getEventById with provided id', () => {
      mockEventService.getEventById.and.returnValue(mockEvent);
      component.handleEditEvent('1');

      expect(mockEventService.getEventById).toHaveBeenCalledWith('1');
    });

    it('should set editingEvent when event is found', () => {
      mockEventService.getEventById.and.returnValue(mockEvent);
      component.handleEditEvent('1');

      expect(component.editingEvent()).toEqual(mockEvent);
    });

    it('should open form modal when event is found', () => {
      mockEventService.getEventById.and.returnValue(mockEvent);
      component.handleEditEvent('1');

      expect(component.isEventFormModalOpen()).toBeTrue();
    });

    it('should close event modal when editing starts', () => {
      component.isEventModalOpen.set(true);
      mockEventService.getEventById.and.returnValue(mockEvent);

      component.handleEditEvent('1');

      expect(component.isEventModalOpen()).toBeFalse();
    });

    it('should not open form modal if event is not found', () => {
      mockEventService.getEventById.and.returnValue(null);
      component.handleEditEvent('999');

      expect(component.isEventFormModalOpen()).toBeFalse();
    });

    it('should not modify editingEvent if event is not found', () => {
      component.editingEvent.set(null);
      mockEventService.getEventById.and.returnValue(null);

      component.handleEditEvent('999');
      expect(component.editingEvent()).toBeNull();
    });

  });

  describe('delete event flow', () => {

    it('should open confirm modal when delete is triggered', () => {
      component.isEventFormModalOpen.set(true);
      component.handleDeleteEvent('123');

      expect((component as any).selectedEventId()).toBe('123');
      expect(component.isConfirmModalOpen()).toBeTrue();
      expect(component.isEventModalOpen()).toBeFalse();
    });

    it('should delete event when confirmDeleteEvent is called', () => {
      (component as any).selectedEventId.set('123');
      component.confirmDeleteEvent();

      expect(mockEventService.deleteEvent).toHaveBeenCalledWith('123');
      expect(component.isConfirmModalOpen()).toBeFalse();
      expect(component.isEventModalOpen()).toBeTrue();
      expect((component as any).selectedEventId()).toBeNull();
    });

    it('should do nothing if confirmDeleteEvent is called with null id', () => {
      (component as any).selectedEventId.set(null);

      const confirmBefore = component.isConfirmModalOpen();
      const eventBefore = component.isEventModalOpen();

      component.confirmDeleteEvent();

      expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
      expect(component.isConfirmModalOpen()).toBe(confirmBefore);
      expect(component.isEventModalOpen()).toBe(eventBefore);
    });

    it('should cancel delete and restore modal state', () => {
      (component as any).selectedEventId.set('123');
      component.isConfirmModalOpen.set(true);
      component.isEventModalOpen.set(false);

      component.cancelDeleteEvent();

      expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
      expect(component.isConfirmModalOpen()).toBeFalse();
      expect(component.isEventModalOpen()).toBeTrue();
      expect((component as any).selectedEventId()).toBeNull();
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

  });

});
