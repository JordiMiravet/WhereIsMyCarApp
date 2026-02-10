import { Component, inject, input, OnInit, output } from '@angular/core';
import { EventService } from '../../services/event-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  
  formEvent: FormGroup;

  constructor(){
    // TODO: Tengo que añadirle mas validaciones
    this.formEvent = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      hourStart: new FormControl('', [Validators.required]),
      hourEnd: new FormControl('', [Validators.required]),
      comment: new FormControl('', [])
    });
  }

  ngOnInit(){
    if(this.preselectedDate()) {
      this.formEvent.patchValue({
        date: this.preselectedDate()
      });
    }
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