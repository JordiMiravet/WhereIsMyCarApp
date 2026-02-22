import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostUsedVehicleChart } from './most-used-vehicle-chart';

describe('MostUsedVehicleChart', () => {
  let component: MostUsedVehicleChart;
  let fixture: ComponentFixture<MostUsedVehicleChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostUsedVehicleChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostUsedVehicleChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
