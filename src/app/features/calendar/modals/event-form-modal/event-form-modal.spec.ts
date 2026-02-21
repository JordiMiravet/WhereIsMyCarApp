import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormModalComponent } from './event-form-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventInterface } from '../../interfaces/event';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';

describe('EventFormModalComponent', () => {
  let component: EventFormModalComponent;
  let fixture: ComponentFixture<EventFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  });

  describe('mode input', () => {

    it('should default to "create" mode', () => {
      component.mode();
      fixture.detectChanges();

      expect(component.mode()).toBe('create');
    });

    it('should accept "edit" mode', () => {
      fixture.componentRef.setInput('mode', 'edit');

      component.mode();
      fixture.detectChanges();

      expect(component.mode()).toBe('edit');
    });

  });

  describe('ngOnInit', () => {

    it('should call loadVehicles on init', () => {
      const vehicles = spyOn(component.vehicleService, 'loadVehicles')
      component.ngOnInit();
      
      expect(vehicles).toHaveBeenCalled()
    });

    it('should patch date if preselectedDate is provided', () => {
      const dateMock = '2026-02-15';

      fixture.componentRef.setInput('preselectedDate', dateMock);
      fixture.detectChanges();

      expect(component.formEvent.get('date')?.value).toBe(dateMock);
    });

    it('should patch form values if event is provided', () => {
      const eventMock = {
        _id: '123',
        title: 'Nintendo Direct',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: '123',
        comment: 'I want a new Zelda!'
      };

      fixture.componentRef.setInput('event', eventMock);
      fixture.detectChanges();

      expect(component.formEvent.get('title')?.value).toBe(eventMock.title);
      expect(component.formEvent.get('date')?.value).toBe(eventMock.date);
      expect(component.formEvent.get('hourStart')?.value).toBe(eventMock.hourStart);
      expect(component.formEvent.get('hourEnd')?.value).toBe(eventMock.hourEnd);
      expect(component.formEvent.get('vehicleId')?.value).toBe(eventMock.vehicleId);
      expect(component.formEvent.get('comment')?.value).toBe(eventMock.comment);
    });

    it('should not patch anything if no inputs are provided', () => {
      fixture.detectChanges();

      expect(component.formEvent.get('title')?.value).toBe('');
      expect(component.formEvent.get('date')?.value).toBe('');
      expect(component.formEvent.get('hourStart')?.value).toBe('');
      expect(component.formEvent.get('hourEnd')?.value).toBe('');
      expect(component.formEvent.get('vehicleId')?.value).toBe('');
      expect(component.formEvent.get('comment')?.value).toBe('');
    });

  });

  describe('Form initialization', () => {

    it('should initialize form with all required controls', () => {
      const controls = component.formEvent.controls;

      expect(controls['title']).toBeTruthy();
      expect(controls['date']).toBeTruthy();
      expect(controls['hourStart']).toBeTruthy();
      expect(controls['hourEnd']).toBeTruthy();
      expect(controls['vehicleId']).toBeTruthy();
      expect(controls['comment']).toBeTruthy();
    });

    it('should initialize form as invalid by default', () => {
      expect(component.formEvent.valid).toBeFalse();
      expect(component.formEvent.invalid).toBeTrue();
    });

  });

  describe('Required field validations', () => {

    it('should mark title as required', () => {
      fixture.detectChanges();

      const title = component.formEvent.controls['title'];
      expect(title.invalid).toBeTrue();
      expect(title.hasError('required')).toBeTrue();
    });

    it('should mark date as required', () => {
      fixture.detectChanges();

      const date = component.formEvent.controls['date'];
      expect(date.invalid).toBeTrue();
      expect(date.hasError('required')).toBeTrue();
    });

    it('should mark hourStart as required', () => {
      fixture.detectChanges();

      const hourStart = component.formEvent.controls['hourStart'];
      expect(hourStart.invalid).toBeTrue();
      expect(hourStart.hasError('required')).toBeTrue();
    });

    it('should mark hourEnd as required', () => {
      fixture.detectChanges();

      const hourEnd = component.formEvent.controls['hourEnd'];
      expect(hourEnd.invalid).toBeTrue();
      expect(hourEnd.hasError('required')).toBeTrue();
    });

    it('should mark vehicleId as required', () => {
      fixture.detectChanges();

      const vehicleId = component.formEvent.controls['vehicleId'];
      expect(vehicleId.invalid).toBeTrue();
      expect(vehicleId.hasError('required')).toBeTrue();
    });

  });

  describe('timeRangeValidator', () => {

    it('should return error if hourStart is greater than hourEnd', () => {
      component.formEvent.patchValue({
        hourStart: '12:00',
        hourEnd: '10:00'
      });

      component.formEvent.updateValueAndValidity();
      expect(component.formEvent.hasError('invalidTimeRange')).toBeTrue();
    });

    it('should return null if hourStart is before hourEnd', () => {
      component.formEvent.patchValue({
        hourStart: '09:00',
        hourEnd: '10:00'
      });

      component.formEvent.updateValueAndValidity();
      expect(component.formEvent.hasError('invalidTimeRange')).toBeFalse();
    });

    it('should return null if hourStart or hourEnd are empty', () => {
      component.formEvent.patchValue({
        hourStart: '',
        hourEnd: ''
      });

      component.formEvent.updateValueAndValidity();
      expect(component.formEvent.hasError('invalidTimeRange')).toBeFalse();
    });

  });

  describe('timeOverlapValidator', () => {

    it('should return null if required fields are missing', () => {
      component.formEvent.patchValue({
        date: '',
        hourStart: '',
        hourEnd: '',
        vehicleId: ''
      });

      component.formEvent.updateValueAndValidity();

      expect(component.formEvent.hasError('timeOverlap')).toBeFalse();
    });

    it('should return error if there is overlapping event', () => {
      component.eventService.getEventsByDate = () => [
        {
          _id: '1',
          date: '2026-02-15',
          hourStart: '10:00',
          hourEnd: '12:00',
          vehicleId: '123',
        } as EventInterface
      ];

      component.formEvent.patchValue({
        date: '2026-02-15',
        hourStart: '11:00',
        hourEnd: '13:00',
        vehicleId: '123'
      });

      component.formEvent.updateValueAndValidity();

      expect(component.formEvent.hasError('timeOverlap')).toBeTrue();
    });

    it('should return null if there is no overlapping event', () => {
      component.eventService.getEventsByDate = () => [
        {
          _id: '1',
          title: 'Nintendo Direct',
          date: '2026-02-15',
          hourStart: '08:00',
          hourEnd: '10:00',
          vehicleId: '123',
          comment: ''
        } as EventInterface
      ];

      component.formEvent.patchValue({
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: '123'
      });

      component.formEvent.updateValueAndValidity();

      expect(component.formEvent.hasError('timeOverlap')).toBeFalse();
    });


    it('should ignore current event when editing', () => {
      const currentEvent = {
        _id: '1',
        title: 'Comida con amigos',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '15:00',
        vehicleId: '123456',
        comment: ''
      };

      fixture.componentRef.setInput('event', currentEvent);
      component.eventService.getEventsByDate = () => { return [currentEvent]};

      component.formEvent.patchValue({
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '15:00',
        vehicleId: '123456'
      });

      component.formEvent.updateValueAndValidity();
      expect(component.formEvent.hasError('timeOverlap')).toBe(false)
    });

  });

  describe('touchTimeControls', () => {

    it('should mark hourStart and hourEnd as touched when hourStart changes', () => {
      fixture.detectChanges();
      
      const hourStart = component.formEvent.get('hourStart');
      const hourEnd = component.formEvent.get('hourEnd');
      
      hourStart?.setValue('10:00');
      
      expect(hourStart?.touched).toBeTrue();
      expect(hourEnd?.touched).toBeTrue();
    });

    it('should mark hourStart and hourEnd as touched when hourEnd changes', () => {
      fixture.detectChanges();
      
      const hourStart = component.formEvent.get('hourStart');
      const hourEnd = component.formEvent.get('hourEnd');
      
      hourEnd?.setValue('12:00');
      
      expect(hourStart?.touched).toBeTrue();
      expect(hourEnd?.touched).toBeTrue();
    });

  });

  describe('onVehicleSelected', () => {

    it('should reset vehicleId if null is passed', () => {
      component.formEvent.patchValue({ vehicleId: '123456' });
      component.onVehicleSelected(null);

      expect(component.formEvent.get('vehicleId')?.value).toBe('');
    });

    it('should set vehicleId when valid vehicle is passed', () => {
      const vehicle : VehicleInterface = {
        _id: '123',
        name: 'Ferrari',
        model: 'F8 Tributo',
        plate: '123456'
      }
      component.onVehicleSelected(vehicle);

      expect(component.formEvent.get('vehicleId')?.value).toBe('123');
    });

    it('should only update vehicleId without affecting other fields', () => {
      component.formEvent.patchValue({
        title: 'State of Play',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: 'old-vehicle-id',
        comment: 'Test comment'
      });

      component.onVehicleSelected({ 
        _id: '123456', 
        name: 'Ferrari', 
        model: 'F8', 
        plate: '123ABC' 
      });

      expect(component.formEvent.get('vehicleId')?.value).toBe('123456');
      expect(component.formEvent.get('title')?.value).toBe('State of Play');
      expect(component.formEvent.get('date')?.value).toBe('2026-02-15');
    });

  });

  describe('onSubmit', () => {

    it('should not submit if form is invalid', () => {
      component.formEvent.patchValue({
        title: '',
        date: '',
        hourStart: '',
        hourEnd: '',
        vehicleId: '',
        comment: ''
      })

      spyOn(component.eventService, 'addEvent');
      spyOn(component.eventService, 'updateEvent');
      spyOn(component.close, 'emit')

      component.onSubmit();

      expect(component.eventService.addEvent).not.toHaveBeenCalled();
      expect(component.eventService.updateEvent).not.toHaveBeenCalled();
      expect(component.close.emit).not.toHaveBeenCalled();
    });

    it('should call addEvent if mode is "create"', () => {
      fixture.componentRef.setInput('mode', 'create');

      component.formEvent.patchValue({
        title: 'BBQ',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '17:00',
        vehicleId: '123456',
        comment: ''
      });

      spyOn(component.eventService, 'addEvent');
      spyOn(component.close, 'emit');

      component.onSubmit();

      expect(component.eventService.addEvent).toHaveBeenCalled();
      expect(component.close.emit).toHaveBeenCalled();
    })


    it('should call updateEvent if mode is "edit"', () => {
      const event = {
        _id: '1',
        title: 'XBOX Direct',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: '123456',
        comment: ''
      }
      fixture.componentRef.setInput('mode', 'edit');
      fixture.componentRef.setInput('event', event);

      component.formEvent.patchValue({
        title: 'XBOX Direct',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: '123456',
        comment: ''
      })

      spyOn(component.eventService, 'updateEvent');
      spyOn(component.close, 'emit');
      component.onSubmit();

      expect(component.eventService.updateEvent).toHaveBeenCalled();
      expect(component.close.emit).toHaveBeenCalled();
    })

    it('should call handleClose after successful submit', () => {
      component.formEvent.patchValue({
        title: 'XBOX Indirect xD',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: '123456',
        comment: ''
      });
      spyOn(component, 'handleClose');
      component.onSubmit();

      expect(component.handleClose).toHaveBeenCalled();
    })

  });

  describe('handleClose', () => {

    it('should reset the form', () => {
      component.formEvent.patchValue({
        title: 'RetroWorld',
        date: '2026-02-15',
        hourStart: '10:00',
        hourEnd: '12:00',
        vehicleId: 'Delorean123',
        comment: 'PS1 > N64. Y no hay mas discusión'
      })
      component.handleClose();

      expect(component.formEvent.get('title')?.value).toBeNull();
      expect(component.formEvent.get('date')?.value).toBeNull();
      expect(component.formEvent.get('hourStart')?.value).toBeNull();
      expect(component.formEvent.get('hourEnd')?.value).toBeNull();
      expect(component.formEvent.get('vehicleId')?.value).toBeNull();
      expect(component.formEvent.get('comment')?.value).toBeNull();
    })

    it('should emit close event', function() {
      spyOn(component.close, 'emit')
      component.handleClose()

      expect(component.close.emit).toHaveBeenCalled()
    })

  })

  describe('Template integration', () => {

    it('should enable save button when form is valid', () => {
      component.formEvent.patchValue({
        title: 'Quedada JDM',
        date: '2026-02-15',
        hourStart: '17:00',
        hourEnd: '22:00',
        vehicleId: 'R34-123456',
        comment: 'Wrap wraaap!'
      })
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.event-form__button--Save');
      expect(button.disabled).toBe(false);
    });

    it('should close modal when clicking overlay', () => {
      const close = spyOn(component, 'handleClose')

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      overlay.click();

      expect(close).toHaveBeenCalled();
    });

    it('should stop propagation when clicking inside form', () => {
      const close = spyOn(component, 'handleClose');

      const form = fixture.nativeElement.querySelector('.event-form');
      form.click();

      expect(close).not.toHaveBeenCalled();
    });

  });

});
