import { Component, inject, input, OnInit, output } from '@angular/core';
import { EventService } from '../../services/event-service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form-modal',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './event-form-modal.html',
  styleUrl: './event-form-modal.css',
})

export class EventFormModalComponent implements OnInit {

  public eventService = inject(EventService);

  public preselectedDate = input<string>('');
  public close = output<void>();
  
  public formEvent: FormGroup;

  constructor(){
    // TODO: Tengo que añadirle mas validaciones
    this.formEvent = new FormGroup({
      title: new FormControl('', [ Validators.required ]),
      date: new FormControl('', [ Validators.required ]),
      hourStart: new FormControl('', [ Validators.required ]),
      hourEnd: new FormControl('', [ Validators.required]),
      comment: new FormControl('', [])
    }, {
      validators: [
        this.timeRangeValidator,
        this.timeOverlapValidator.bind(this)
      ]
    });
  }

  ngOnInit(){
    if(this.preselectedDate()) {
      this.formEvent.patchValue({
        date: this.preselectedDate()
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
    const { date, hourStart, hourEnd } = control.value;
    if (!date || !hourStart || !hourEnd) return null;

    const eventsOfThisDay = this.eventService.getEventsByDate(date);
    const hasTimeConflict  = eventsOfThisDay.some(event =>
      hourStart < event.hourEnd! && hourEnd > event.hourStart!
    );

    return hasTimeConflict 
      ? { timeOverlap: true } 
      : null;
  }


  onSubmit():void {
    if(this.formEvent.valid) {
      this.eventService.addEvent(this.formEvent.value);
      this.handleClose();
    }
  }

  handleClose() {
    this.formEvent.reset();
    this.close.emit();
  }
}