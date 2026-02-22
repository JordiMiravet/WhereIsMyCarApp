import { Component, effect, ElementRef, inject, input, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

import { TimePeriod } from '../../enums/time-period.enum';

import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';


@Component({
  selector: 'app-hours-by-weekday-vehicle-chart',
  standalone: true,
  imports: [],
  templateUrl: './hours-by-weekday-vehicle-chart.html',
  styleUrl: './hours-by-weekday-vehicle-chart.css',
})

export class HoursByWeekdayVehicleChartComponent implements OnDestroy {

  @ViewChild('hoursByWeekday') hoursByWeekday!: ElementRef<HTMLCanvasElement>;

  public period = input<TimePeriod>(TimePeriod.Month);
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);
  
  private chart!: Chart;

  constructor() {
    effect(() => {
      this.vehicleService.vehicles();
      this.period();

      if(this.hoursByWeekday) {
        this.createHoursByWeekdayByVehicle()
      }
    })
  }

  ngOnDestroy(): void {
    if(this.chart) {
      this.chart.destroy();
    }
  }

  private createHoursByWeekdayByVehicle(): void {
  
    const data = this.graphicsService.getHoursByWeekdayPerVehicle(this.period());
    if (!data) return;

    if(this.chart) {
      this.chart.destroy();
    }

    const canvasElement = this.hoursByWeekday.nativeElement.getContext('2d')!;

    const vehicleData = data.vehicles.map(vehicle => ({
      label: vehicle.name,
      data: vehicle.hours,
      borderWidth: 2,
      fill: false,
      tension: 0.2
    }));

    this.chart = new Chart(canvasElement, {
      type: 'line',
      data: {
        labels: data.weekdayNames,
        datasets: vehicleData
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Usage by Day of Week',
            font: { size: 20 }
          },
          legend: {
            display: true
          }
        }
      }
    });
  }
  
}
