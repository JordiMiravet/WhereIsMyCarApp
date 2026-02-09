import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { CalendarEventInterface } from '../../interfaces/calendar-event';
import { EditButtonComponent } from '../../../../shared/components/buttons/edit-button/edit-button';
import { DeleteButtonComponent } from '../../../../shared/components/buttons/delete-button/delete-button';

@Component({
  selector: 'app-day-events-modal',
  standalone: true,
  imports: [ 
    CommonModule, 
    EditButtonComponent, 
    DeleteButtonComponent
  ],
  templateUrl: './day-events-modal.html',
  styleUrl: './day-events-modal.css',
})

export class DayEventsModalComponent {

  events = input<CalendarEventInterface[]>([]);
  date = input<string>('');

  closeModal = output<void>();
  deleteEvent = output<number>();

  openDetails(index: number) {
    const list = document.querySelectorAll<HTMLDetailsElement>('.day-events__details');
    list.forEach((detail, i) => {
      if(i !== index) {
        detail.open = false;
      }
    });
  }

  editEvent(event: any): void {}

  onDelete(index: number): void {
    this.deleteEvent.emit(index);
  }

  handleClose() {
    this.closeModal.emit();
  }

}
