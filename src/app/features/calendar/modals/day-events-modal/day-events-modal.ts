import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { EventInterface } from '../../interfaces/event';
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

  date = input<string>('');
  events = input<EventInterface[]>([]);
  
  createEvent = output<void>();
  editEvent = output<string>();
  deleteEvent = output<string>();
  
  closeModal = output<void>();
  
  onCreate() {
    this.createEvent.emit();
  }

  onEdit(id: string): void {
    this.editEvent.emit(id);
  }
  
  onDelete(id: string): void {
    this.deleteEvent.emit(id);
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
