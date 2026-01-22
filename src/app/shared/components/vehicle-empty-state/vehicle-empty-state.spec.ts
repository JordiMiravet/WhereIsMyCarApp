import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEmptyState } from './vehicle-empty-state';

describe('VehicleEmptyState', () => {
  let component: VehicleEmptyState;
  let fixture: ComponentFixture<VehicleEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEmptyState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
