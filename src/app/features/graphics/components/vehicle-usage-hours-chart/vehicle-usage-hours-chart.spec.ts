import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleUsageHoursChartComponent } from './vehicle-usage-hours-chart';
import { HttpClientModule } from '@angular/common/http';
import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

describe('VehicleUsageHoursChartComponent', () => {
  let component: VehicleUsageHoursChartComponent;
  let fixture: ComponentFixture<VehicleUsageHoursChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VehicleUsageHoursChartComponent,
        HttpClientModule
      ],
      providers: [
        GraphicsServices,
        VehicleService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleUsageHoursChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
