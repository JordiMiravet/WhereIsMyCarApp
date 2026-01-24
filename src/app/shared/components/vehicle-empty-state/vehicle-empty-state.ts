import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-vehicle-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-empty-state.html',
  styleUrl: './vehicle-empty-state.css',
})
export class VehicleEmptyStateComponent {

  readonly createVehicle = output<void>();
  public actionState = input<boolean>(true);
  
  onClick(){
    this.createVehicle.emit()
  }

}
