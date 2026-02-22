import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { GraphicsServices } from '../../services/graphics-services';

@Component({
  selector: 'app-most-used-vehicle-chart',
  imports: [],
  templateUrl: './most-used-vehicle-chart.html',
  styleUrl: './most-used-vehicle-chart.css',
})
export class MostUsedVehicleChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mostUsedVehicle') mostUsedVehicle!: ElementRef<HTMLCanvasElement>;

  private graphicsService = inject(GraphicsServices);

  private chart!: Chart;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMostUsedVehicleChart()
    }, 100)
  }

  ngOnDestroy(): void {
    if(this.chart){
      this.chart.destroy();
    }
  }

  /* Vehiculo mas usado */
  
  public createMostUsedVehicleChart(): void {
    const data = this.graphicsService.getMostUsedVehicle();
    if(!data) return;

    const canvasElement = this.mostUsedVehicle.nativeElement.getContext('2d')!;

    this.chart = new Chart(canvasElement, {
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

  
}
