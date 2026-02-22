import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleUsageHoursChart } from './vehicle-usage-hours-chart';

describe('VehicleUsageHoursChart', () => {
  let component: VehicleUsageHoursChart;
  let fixture: ComponentFixture<VehicleUsageHoursChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleUsageHoursChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleUsageHoursChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
