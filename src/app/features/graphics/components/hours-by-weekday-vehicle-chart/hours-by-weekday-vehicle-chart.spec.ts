import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursByWeekdayVehicleChart } from './hours-by-weekday-vehicle-chart';

describe('HoursByWeekdayVehicleChart', () => {
  let component: HoursByWeekdayVehicleChart;
  let fixture: ComponentFixture<HoursByWeekdayVehicleChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursByWeekdayVehicleChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursByWeekdayVehicleChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
