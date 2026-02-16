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

export class GraphicsView implements AfterViewInit {

  @ViewChild('myChart') chartRef!: ElementRef<HTMLCanvasElement>;
  
  private graphicsService = inject(GraphicsServices);
  private vehicleService = inject(VehicleService);

  chart!: Chart;

  ngAfterViewInit(): void {
    this.vehicleService.loadVehicles();
    setTimeout(() => {
      this.createChart();
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.chart) {
      this.chart.destroy();
    }
  }

  createChart(): void {
    const data = this.graphicsService.getVehicleMetrics();

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
    
    const canvasElement = this.chartRef.nativeElement.getContext('2d')!;
    
    this.chart = new Chart(canvasElement, {
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

}
