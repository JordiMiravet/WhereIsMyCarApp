import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import Chart from 'chart.js/auto';

import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { VehicleUsageHoursChartComponent } from "../vehicle-usage-hours-chart/vehicle-usage-hours-chart";
import { MostUsedVehicleChartComponent } from "../most-used-vehicle-chart/most-used-vehicle-chart";

@Component({
  selector: 'app-graphics-view',
  standalone: true,
  imports: [CommonModule, VehicleUsageHoursChartComponent, MostUsedVehicleChartComponent],
  templateUrl: './graphics-view.html',
  styleUrl: './graphics-view.css',
})

export class GraphicsViewComponent implements AfterViewInit {

  @ViewChild('mostUsedVehicle') mostUsedVehicle!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hoursByWeekday') hoursByWeekday!: ElementRef<HTMLCanvasElement>;
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  mostUsedVehicleChart!: Chart;
  hoursByWeekdayChart!: Chart;

  ngAfterViewInit(): void {
    this.vehicleService.loadVehicles();
    setTimeout(() => {
      this.createHoursByWeekdayByVehicle();
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.hoursByWeekdayChart) {
      this.hoursByWeekdayChart.destroy();
    }
  }

  /* Vehiculo mas usado */

  public createMostUsedVehicleChart(): void {
    const data = this.graphicsService.getMostUsedVehicle();
    if(!data) return;

    const canvasElement = this.mostUsedVehicle.nativeElement.getContext('2d')!;

    this.mostUsedVehicleChart = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: [data.vehicleName],
        datasets: [{
          label: 'Most Used Vehicle (Hours)',
          data: [data.totalHours],
          backgroundColor: 'rgba(255, 99, 132, 0.75)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Most Used Vehicle',
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

  /* Horas por coche por semana */

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

    this.hoursByWeekdayChart = new Chart(canvasElement, {
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
