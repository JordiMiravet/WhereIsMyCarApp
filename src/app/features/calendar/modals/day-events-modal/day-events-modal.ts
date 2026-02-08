import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { EditButtonComponent } from '../../../../shared/components/buttons/edit-button/edit-button';
import { DeleteButtonComponent } from '../../../../shared/components/buttons/delete-button/delete-button';
import { CalendarEventInterface } from '../../interfaces/calendar-event';

@Component({
  selector: 'app-day-events-modal',
  standalone: true,
  imports: [ CommonModule, EditButtonComponent, DeleteButtonComponent],
  templateUrl: './day-events-modal.html',
  styleUrl: './day-events-modal.css',
})

export class DayEventsModalComponent {

  events = input<CalendarEventInterface[]>([]);
  date = input<string>('');
  isOpen = model<boolean>(false);
  closeModal = output<void>();

  handleClose() {
    this.closeModal.emit();
  }

  openDetails(index: number) {
    const list = document.querySelectorAll<HTMLDetailsElement>('.day-events__details');
    
    list.forEach((detail, i) => {
      if(i !== index) {
        detail.open = false;
      }
    });
  }

}
