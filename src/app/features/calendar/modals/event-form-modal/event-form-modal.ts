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
  public preselectedEvent = input<EventInterface | null>(null);
  
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

  ngOnInit(){
    this.vehicleService.loadVehicles();

    const date = this.preselectedDate()
    if(date) {
      this.formEvent.patchValue({
        date: this.preselectedDate()
      });
    }

    const event = this.preselectedEvent();
    if(event) {
      this.formEvent.patchValue({
        title: event.title,
        date: event.date,
        hourStart: event.hourStart,
        hourEnd: event.hourEnd,
        vehicleId: event.vehicleId,
        comment: event.comment
      })
    }
  }

  onVehicleSelected(vehicle: VehicleInterface | null) {
    if (!vehicle) {
      this.formEvent.patchValue({ vehicleId: '' });
      return;
    }

    this.formEvent.patchValue({
      vehicleId: vehicle._id
    });

    const event = this.preselectedEvent();
    if (event) {
      this.formEvent.patchValue({
        title: event?.title,
        date: event?.date,
        hourStart: event?.hourStart,
        hourEnd: event?.hourEnd,
        vehicleId: event?.vehicleId,
        comment: event?.comment
      });
    }

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
      .filter(event => event._id !== this.preselectedEvent()?._id);

    const hasTimeConflict = eventsOfThisDay.some(event =>
      hourStart < event.hourEnd! && hourEnd > event.hourStart!
    );

    return hasTimeConflict 
      ? { timeOverlap: true } 
      : null;
  }

  onSubmit(): void {
    if (!this.formEvent.valid) return;

    if (this.preselectedEvent()) {
      this.eventService.updateEvent({
        ...this.preselectedEvent(),
        ...this.formEvent.value
      });
    } else {
      this.eventService.addEvent(this.formEvent.value);
    }

    this.handleClose();
  }

  handleClose() {
    this.formEvent.reset();
    this.close.emit();
  }
}