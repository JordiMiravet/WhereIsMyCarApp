import { Component } from '@angular/core';
import { VehicleViewComponent } from "../../features/vehicle/components/vehicle-view/vehicle-view";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ VehicleViewComponent ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent {}
