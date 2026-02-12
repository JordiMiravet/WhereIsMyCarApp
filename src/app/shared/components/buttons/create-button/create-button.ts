import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-create-button',
  standalone: true,
  imports: [],
  templateUrl: './create-button.html',
  styleUrl: './create-button.css',
})

export class CreateButtonComponent {

  readonly createText = input<string | null>(null);
  readonly create = output<void>();

  onClick(): void {
    this.create.emit(); 
  }
  
}
