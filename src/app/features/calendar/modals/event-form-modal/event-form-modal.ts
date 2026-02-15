import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventService } from '../../services/event-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { EventInterface } from '../../interfaces/event';

@Component({
  selector: 'app-event-form-modal',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    CommonModule 
  ],
  templateUrl: './event-form-modal.html',
  styleUrl: './event-form-modal.css',
})

export class EventFormModalComponent implements OnInit {

  public eventService = inject(EventService);
  public vehicleService = inject(VehicleService);

  public vehicles = this.vehicleService.vehicles;

  public preselectedDate = input<string>('');
  public mode = input<'create' | 'edit'>('create');
  public event = input<EventInterface | null>(null);
  
  public close = output<void>();

  public formEvent: FormGroup;

  constructor(){
    this.formEvent = new FormGroup({
      title: new FormControl('', [ Validators.required ]),
      date: new FormControl('', [ Validators.required ]),
      hourStart: new FormControl('', [ Validators.required ]),
      hourEnd: new FormControl('', [ Validators.required ]),
      vehicleId: new FormControl('', [ Validators.required ]),
      comment: new FormControl('', [])
    }, {
      validators: [
        this.timeRangeValidator,
        this.timeOverlapValidator.bind(this)
      ]
    });
  }

  ngOnInit(): void {
    this.vehicleService.loadVehicles();
    this.initializeFormValues();
    this.touchTimeControls();
  }

  private initializeFormValues(): void {
    const date = this.preselectedDate()
    if(date) {
      this.formEvent.patchValue({ date: date });
    }

    const EventData = this.event();
    if(EventData) {
      this.formEvent.patchValue({
        title: EventData.title,
        date: EventData.date,
        hourStart: EventData.hourStart,
        hourEnd: EventData.hourEnd,
        vehicleId: EventData.vehicleId,
        comment: EventData.comment
      })
    }
  }

  private touchTimeControls(): void {
    const hourStart = this.formEvent.get('hourStart');
    const hourEnd = this.formEvent.get('hourEnd');

    hourStart?.valueChanges.subscribe(() => {
      hourStart?.markAsTouched();
      hourEnd?.markAsTouched();
    });

    hourEnd?.valueChanges.subscribe(() => {
      hourStart?.markAsTouched();
      hourEnd?.markAsTouched();
    });
  }


  public onVehicleSelected(vehicle: VehicleInterface | null): void {
    if (!vehicle) {
      this.formEvent.patchValue({ vehicleId: '' });
      return;
    }
    this.formEvent.patchValue({ vehicleId: vehicle._id });
  }


  private timeRangeValidator(control: AbstractControl): ValidationErrors | null {
    const { hourStart, hourEnd } = control.value;
    if (!hourStart || !hourEnd) return null;

    return hourStart >= hourEnd 
      ? { invalidTimeRange: true } 
      : null;
  }

  private timeOverlapValidator(control: AbstractControl): ValidationErrors | null {
    const { date, hourStart, hourEnd, vehicleId } = control.value;
    if (!date || !hourStart || !hourEnd || !vehicleId) return null;

    const eventsOfThisDay = this.eventService
      .getEventsByDate(date)
      .filter(event => event.vehicleId === vehicleId)
      .filter(event => event._id !== this.event()?._id);

    const hasTimeConflict = eventsOfThisDay.some(event =>
      hourStart < event.hourEnd! && hourEnd > event.hourStart!
    );

    return hasTimeConflict 
      ? { timeOverlap: true } 
      : null;
  }

  onSubmit(): void {
    if (!this.formEvent.valid) return;

    if (this.mode() === 'edit') {
      this.eventService.updateEvent({
        ...this.event(),
        ...this.formEvent.value
      });
    } else {
      this.eventService.addEvent(this.formEvent.value);
    }

    this.handleClose();
  }

  handleClose(): void {
    this.formEvent.reset();
    this.close.emit();
  }
}