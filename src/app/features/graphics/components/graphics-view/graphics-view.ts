import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import Chart from 'chart.js/auto';

import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

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
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  vehicleUsageChart!: Chart;
  mostUsedVehicleChart!: Chart;

  ngAfterViewInit(): void {
    this.vehicleService.loadVehicles();
    setTimeout(() => {
      this.createvehicleUsageHoursChart();
      this.createMostUsedVehicleChart();
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.vehicleUsageChart) {
      this.vehicleUsageChart.destroy();
    }
    if(this.mostUsedVehicleChart) {
      this.mostUsedVehicleChart.destroy();
    }
  }

  createvehicleUsageHoursChart(): void {
    const data = this.graphicsService.getVehicleUsageHours();

    const labels = data.map(item => item.vehicleName);
    const values = data.map(item => item.totalHours);
    
    const colors = [
      'rgba(54, 162, 235, 0.75)',
      'rgba(255, 99, 132, 0.75)',
      'rgba(75, 192, 192, 0.75)',
      'rgba(255, 205, 86, 0.75)', 
      'rgba(153, 102, 255, 0.75)',
      'rgba(255, 159, 64, 0.75)',
      'rgba(201, 203, 207, 0.75)',
      'rgba(54, 99, 235, 0.75)',
      'rgba(255, 102, 132, 0.75)'
    ];
    
    const canvasElement = this.vehicleUsageHours.nativeElement.getContext('2d')!;
    
    this.vehicleUsageChart = new Chart(canvasElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hours of Use',
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          hoverOffset: 10 
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

  createMostUsedVehicleChart(): void {
    const mostUsed = this.graphicsService.getMostUsedVehicle();
    if(!mostUsed) return;

    const canvasElement = this.mostUsedVehicle.nativeElement.getContext('2d')!;

    this.mostUsedVehicleChart = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: [mostUsed.vehicleName],
        datasets: [{
          label: 'Most Used Vehicle (Hours)',
          data: [mostUsed.totalHours],
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

}
