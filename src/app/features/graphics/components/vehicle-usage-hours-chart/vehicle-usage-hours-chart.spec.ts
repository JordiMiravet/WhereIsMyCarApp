import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleUsageHoursChartComponent } from './vehicle-usage-hours-chart';

describe('VehicleUsageHoursChartComponent', () => {
  let component: VehicleUsageHoursChartComponent;
  let fixture: ComponentFixture<VehicleUsageHoursChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleUsageHoursChartComponent]
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
