import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { CalendarEventInterface } from '../../interfaces/calendar-event';
import { EditButtonComponent } from '../../../../shared/components/buttons/edit-button/edit-button';
import { DeleteButtonComponent } from '../../../../shared/components/buttons/delete-button/delete-button';
import { CreateButtonComponent } from "../../../../shared/components/buttons/create-button/create-button";

@Component({
  selector: 'app-day-events-modal',
  standalone: true,
  imports: [
    CommonModule,
    EditButtonComponent,
    DeleteButtonComponent,
    CreateButtonComponent
],
  templateUrl: './day-events-modal.html',
  styleUrl: './day-events-modal.css',
})

export class DayEventsModalComponent {

  events = input<CalendarEventInterface[]>([]);
  date = input<string>('');

  deleteEvent = output<number>();
  editEvent = output<number>();
  createEvent = output<void>();

  closeModal = output<void>();
  
  onCreate() {
    this.createEvent.emit();
  }

  onEdit(event: any): void {
    this.editEvent.emit(event);
  }
  
  onDelete(index: number): void {
    this.deleteEvent.emit(index);
  }

  openDetails(index: number) {
    const list = document.querySelectorAll<HTMLDetailsElement>('.day-events__details');
    list.forEach((detail, i) => {
      if(i !== index) {
        detail.open = false;
      }
    });
  }

  handleClose() {
    this.closeModal.emit();
  }

}
