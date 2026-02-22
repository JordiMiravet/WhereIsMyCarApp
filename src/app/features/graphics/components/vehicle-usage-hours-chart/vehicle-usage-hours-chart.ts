import { Component, effect, ElementRef, inject, input, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { TimePeriod } from '../../enums/time-period.enum';
import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

@Component({
  selector: 'app-vehicle-usage-hours-chart',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-usage-hours-chart.html',
  styleUrl: './vehicle-usage-hours-chart.css',
})

export class VehicleUsageHoursChartComponent implements OnDestroy {

  @ViewChild('vehicleUsageHours') vehicleUsageHours!: ElementRef<HTMLCanvasElement>;

  public period = input<TimePeriod>(TimePeriod.Month);
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  private chart!: Chart;

  constructor() {
    effect(() => {
      this.vehicleService.vehicles();
      this.period();

      if (this.vehicleUsageHours) {
        this.createVehicleUsageHours();
      }
    });
  }

  ngOnDestroy(): void {
    if(this.chart) {
      this.chart.destroy();
    }
  }
  
  private createVehicleUsageHours(): void {

    const data = this.graphicsService.getVehicleUsageHours(this.period());
    if (!data.length) return;

    const labels = data.map(item => item.vehicleName);
    const values = data.map(item => item.totalHours);

    if (this.chart) {
      this.chart.destroy();
    }

    const canvasElement = this.vehicleUsageHours.nativeElement.getContext('2d')!;
    
    this.chart = new Chart(canvasElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hours of Use (Current Month)',
          data: values,
          
          borderWidth: 2,
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Vehicle Usage by Hours',
            font: { size: 20 }
          },
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              boxWidth: 15,
              boxHeight: 15,
              padding: 15,
              font: { size: 15, weight: 'normal' }
            }
          }
        }
      }
    });
  }
  
}
