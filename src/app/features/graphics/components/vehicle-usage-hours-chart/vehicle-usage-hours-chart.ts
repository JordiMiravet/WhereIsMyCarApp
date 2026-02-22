import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { GraphicsServices } from '../../services/graphics-services';

@Component({
  selector: 'app-vehicle-usage-hours-chart',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-usage-hours-chart.html',
  styleUrl: './vehicle-usage-hours-chart.css',
})

export class VehicleUsageHoursChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('vehicleUsageHours') vehicleUsageHours!: ElementRef<HTMLCanvasElement>;

  private graphicsService = inject(GraphicsServices);

  private chart!: Chart;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart()
    }, 250)
  }

  ngOnDestroy(): void {
    if(this.chart) {
      this.chart.destroy();
    }
  }
  
  private createChart(): void {
    const data = this.graphicsService.getVehicleUsageHours();
    
    const labels = data.map(item => item.vehicleName);
    const values = data.map(item => item.totalHours);

    const canvasElement = this.vehicleUsageHours.nativeElement.getContext('2d')!;
    
    this.chart = new Chart(canvasElement, {
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
  
}
