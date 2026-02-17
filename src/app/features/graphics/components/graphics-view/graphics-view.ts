import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import Chart from 'chart.js/auto';

import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { canvas } from 'leaflet';

@Component({
  selector: 'app-graphics-view',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './graphics-view.html',
  styleUrl: './graphics-view.css',
})

export class GraphicsViewComponent implements AfterViewInit {

  @ViewChild('vehicleUsageHours') vehicleUsageHours!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mostUsedVehicle') mostUsedVehicle!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hoursByWeekday') hoursByWeekday!: ElementRef<HTMLCanvasElement>;
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  vehicleUsageHoursChart!: Chart;
  mostUsedVehicleChart!: Chart;
  hoursByWeekdayChart!: Chart;

  ngAfterViewInit(): void {
    this.vehicleService.loadVehicles();
    setTimeout(() => {
      this.createVehicleUsageHoursChart();
      this.createMostUsedVehicleChart();
      this.createHoursByWeekdayByVehicle();
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.vehicleUsageHoursChart) {
      this.vehicleUsageHoursChart.destroy();
    }
    if(this.mostUsedVehicleChart) {
      this.mostUsedVehicleChart.destroy();
    }
    if(this.hoursByWeekdayChart) {
      this.hoursByWeekdayChart.destroy();
    }
  }

  /* Horas por vehiculo */

  public createVehicleUsageHoursChart(): void {
    const data = this.graphicsService.getVehicleUsageHours();

    const labels = data.map(item => item.vehicleName);
    const values = data.map(item => item.totalHours);

    
    const canvasElement = this.vehicleUsageHours.nativeElement.getContext('2d')!;
    
    this.vehicleUsageHoursChart = new Chart(canvasElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hours of Use',
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
            text: 'Vehicle Usage (Hours)',
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
