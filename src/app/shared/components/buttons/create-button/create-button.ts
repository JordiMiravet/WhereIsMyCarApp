import { Component, EventEmitter, input, output } from '@angular/core';

@Component({
  selector: 'app-create-button',
  imports: [],
  templateUrl: './create-button.html',
  styleUrl: './create-button.css',
})
export class CreateButton {

  create = output<void>();

  onClick(): void {
    this.create.emit(); 
  }
  
}
