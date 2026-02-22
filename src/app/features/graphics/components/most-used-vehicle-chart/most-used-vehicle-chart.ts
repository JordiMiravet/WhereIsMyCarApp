import { Component, effect, ElementRef, inject, input, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

import { TimePeriod } from '../../enums/time-period.enum';

import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';


@Component({
  selector: 'app-most-used-vehicle-chart',
  standalone: true,
  imports: [],
  templateUrl: './most-used-vehicle-chart.html',
  styleUrl: './most-used-vehicle-chart.css',
})

export class MostUsedVehicleChartComponent implements OnDestroy {

  @ViewChild('mostUsedVehicle') mostUsedVehicle!: ElementRef<HTMLCanvasElement>;

  public period = input<TimePeriod>(TimePeriod.Month);
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  private chart!: Chart;

  constructor() {
    effect(() => {
      this.vehicleService.vehicles();
      this.period();

      if (this.mostUsedVehicle) {
        this.createMostUsedVehicleChart();
      }
    });
  }

  ngOnDestroy(): void {
    if(this.chart){
      this.chart.destroy();
    }
  }
 
  private createMostUsedVehicleChart(): void {

    const data = this.graphicsService.getMostUsedVehicle(this.period());
    if(!data.length) return;

    if(this.chart){
      this.chart.destroy();
    }

    const canvasElement = this.mostUsedVehicle.nativeElement.getContext('2d')!;

    this.chart = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: data.map(v => v.vehicleName),
        datasets: [{
          label: 'Top 3 Most Used (Current Month)',
          data: data.map(v => v.totalHours),
          backgroundColor: [
            'rgba(255, 99, 132, 0.75)',
            'rgba(54, 162, 235, 0.75)',
            'rgba(75, 192, 192, 0.75)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top 3 Most Used Vehicles',
            font: { size: 20 }
          },
          legend: {
            display: false,
            position: 'bottom',
            align: 'center',
            labels: {
              font: { size: 15, weight: 'normal' }
            }
          }
        }
      }
    });
  }

  
}
