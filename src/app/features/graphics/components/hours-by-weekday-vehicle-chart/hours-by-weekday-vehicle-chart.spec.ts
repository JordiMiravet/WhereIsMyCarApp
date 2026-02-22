import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursByWeekdayVehicleChartComponent } from './hours-by-weekday-vehicle-chart';
import { HttpClientModule } from '@angular/common/http';
import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

describe('HoursByWeekdayVehicleChartComponent', () => {
  let component: HoursByWeekdayVehicleChartComponent;
  let fixture: ComponentFixture<HoursByWeekdayVehicleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HoursByWeekdayVehicleChartComponent,
        HttpClientModule
      ],
      providers: [
        GraphicsServices,
        VehicleService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursByWeekdayVehicleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
