import { Component, input, output } from '@angular/core';
import { CreateButtonComponent } from "../../../../shared/components/buttons/create-button/create-button";

@Component({
  selector: 'app-vehicle-empty-state',
  standalone: true,
  imports: [CreateButtonComponent],
  templateUrl: './vehicle-empty-state.html',
  styleUrl: './vehicle-empty-state.css',
})
export class VehicleEmptyStateComponent {

  readonly createVehicle = output<void>();

  onClick(){
    this.createVehicle.emit()
  }

}
