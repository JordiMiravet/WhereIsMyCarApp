import { Component, inject } from '@angular/core';
import { MapViewComponent } from "../../features/map/components/map-view/map-view";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../shared/components/vehicle-empty-state/vehicle-empty-state";
import { VehicleModalStateService } from '../../features/vehicle/services/vehicle-modal-state-service/vehicle-modal-state-service';
import { VehicleFormModalComponent } from "../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal";
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MapViewComponent,
    VehicleEmptyStateComponent,
    VehicleFormModalComponent
],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})

export class MapComponent {
  
  private vehicleService = inject(VehicleService);
  public vehicleList = this.vehicleService.vehicles;
  public vehicleModal = inject(VehicleModalStateService);
 
  // Me da error porque no tiene localizacion entonces cuando quiero ponerlo en el mapa no funciona
  // Creo que probaré con el userLocation para que tenga una localizacion inicial y de ahí ya veremos 
  
  saveVehicle(vehicleData: VehicleInterface):void {
    if(this.vehicleModal.mode() === 'create'){
      this.vehicleService.addVehicles(vehicleData);
    }
    this.vehicleModal.close();
  }
}
