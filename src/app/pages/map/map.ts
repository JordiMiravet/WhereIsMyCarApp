import { Component, inject } from '@angular/core';
import { MapViewComponent } from "../../features/map/components/map-view/map-view";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../shared/components/vehicle-empty-state/vehicle-empty-state";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapViewComponent, VehicleEmptyStateComponent],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})

export class MapComponent {

  private vehicleService = inject(VehicleService)
  public vehicleList = this.vehicleService.vehicles
  
}
