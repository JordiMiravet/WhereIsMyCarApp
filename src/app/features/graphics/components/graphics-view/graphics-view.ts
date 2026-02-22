import { AfterViewInit, Component, inject, signal,} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimePeriod } from '../../enums/time-period.enum';

import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { VehicleUsageHoursChartComponent } from "../vehicle-usage-hours-chart/vehicle-usage-hours-chart";
import { MostUsedVehicleChartComponent } from "../most-used-vehicle-chart/most-used-vehicle-chart";
import { HoursByWeekdayVehicleChartComponent } from "../hours-by-weekday-vehicle-chart/hours-by-weekday-vehicle-chart";

@Component({
  selector: 'app-graphics-view',
  standalone: true,
  imports: [ 
    CommonModule, 
    VehicleUsageHoursChartComponent, 
    MostUsedVehicleChartComponent, 
    HoursByWeekdayVehicleChartComponent
  ],
  templateUrl: './graphics-view.html',
  styleUrl: './graphics-view.css',
})

export class GraphicsViewComponent implements AfterViewInit {

  private vehicleService = inject(VehicleService);

  public selectedPeriod = signal<TimePeriod>(TimePeriod.Month);
  public TimePeriod = TimePeriod;

  ngAfterViewInit(): void {
    this.vehicleService.loadVehicles();
  }

  changePeriod(period: TimePeriod): void {
    this.selectedPeriod.set(period);
  }
}