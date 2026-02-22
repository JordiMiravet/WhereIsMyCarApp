import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { GraphicsServices } from '../../services/graphics-services';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-hours-by-weekday-vehicle-chart',
  standalone: true,
  imports: [],
  templateUrl: './hours-by-weekday-vehicle-chart.html',
  styleUrl: './hours-by-weekday-vehicle-chart.css',
})
export class HoursByWeekdayVehicleChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('hoursByWeekday') hoursByWeekday!: ElementRef<HTMLCanvasElement>;
  
  private graphicsService = inject(GraphicsServices);

  private chart!: Chart;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createHoursByWeekdayByVehicle()
    }, 50)
  }

  ngOnDestroy(): void {
    if(this.chart) {
      this.chart.destroy();
    }
  }

  public createHoursByWeekdayByVehicle(): void {
  
    const data = this.graphicsService.getHoursByWeekdayPerVehicle();
    if (!data) return;

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
            text: 'Hours per Days & Vehicle',
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
