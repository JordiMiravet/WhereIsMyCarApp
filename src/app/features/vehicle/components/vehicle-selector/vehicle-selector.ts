import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './vehicle-selector.html',
  styleUrl: './vehicle-selector.css',
})
export class VehicleSelectorComponent {

  vehicles = input<VehicleInterface[]>([]);
  selectedPlate = input<string | null>(null);

  vehicleSelected = output<VehicleInterface>();

  onVehicleChange(event: Event): void {
    const plate = (event.target as HTMLSelectElement).value;
    const vehicle = this.vehicles().find(
      v => v.plate === plate
    );

    if (!vehicle) return;

    this.vehicleSelected.emit(vehicle);
  }
}
