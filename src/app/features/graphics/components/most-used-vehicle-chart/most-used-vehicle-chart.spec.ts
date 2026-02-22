import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostUsedVehicleChartComponent } from './most-used-vehicle-chart';
import { HttpClientModule } from '@angular/common/http';
import { GraphicsServices } from '../../services/graphics-services';
import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';

describe('MostUsedVehicleChartComponent', () => {
  let component: MostUsedVehicleChartComponent;
  let fixture: ComponentFixture<MostUsedVehicleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MostUsedVehicleChartComponent,
        HttpClientModule, 
      ],
      providers: [
        GraphicsServices,
        VehicleService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostUsedVehicleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
