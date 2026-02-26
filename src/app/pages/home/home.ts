
import { Component, inject, signal } from '@angular/core';
import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { VehicleFormModalComponent } from '../../features/vehicle/modals/vehicle-form-modal/vehicle-form-modal';
import { ConfirmModalComponent } from "../../shared/components/modals/confirm-modal/confirm-modal";
import { CreateButtonComponent } from "../../shared/components/buttons/create-button/create-button";
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleEmptyStateComponent } from "../../features/vehicle/components/vehicle-empty-state/vehicle-empty-state";
import { VehicleModalStateService } from '../../features/vehicle/services/vehicle-modal-state-service/vehicle-modal-state-service';
import { GeolocationService } from '../../shared/services/geolocation/geolocation-service';
import { VehicleTableComponent } from "../../features/vehicle/components/vehicle-table/vehicle-table";
import { VehicleViewComponent } from "../../features/vehicle/components/vehicle-view/vehicle-view";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    VehicleFormModalComponent,
    ConfirmModalComponent,
    CreateButtonComponent,
    VehicleEmptyStateComponent,
    VehicleTableComponent,

    VehicleViewComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent {

}
