import { Component, input, output } from '@angular/core';
import { EditButtonComponent } from '../../../../shared/components/buttons/edit-button/edit-button';
import { DeleteButtonComponent } from '../../../../shared/components/buttons/delete-button/delete-button';
import { CommonModule } from '@angular/common';
import { VehicleInterface } from '../../interfaces/vehicle';
import { VehicleModalStateService } from '../../services/vehicle-modal-state-service/vehicle-modal-state-service';

@Component({
  selector: 'app-vehicle-table',
  standalone: true,
  imports: [ 
    EditButtonComponent, 
    DeleteButtonComponent, 
    CommonModule 
  ],
  templateUrl: './vehicle-table.html',
  styleUrl: './vehicle-table.css',
})
export class VehicleTableComponent {
  
  vehicles = input<VehicleInterface[]>([]);
  vehicleModal = input<any>();

  deleteVehicle = output<VehicleInterface>();
  
}
